"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Search, ShoppingCart, User, LogOut, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

const categories = [
  "Electronics",
  "Clothing",
  "Home & Garden",
  "Sports & Outdoors",
  "Books",
  "Toys & Games",
];

export default function Homepage() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
  const [addingToCart, setAddingToCart] = useState<number | null>(null);
  const [loadingCart, setLoadingCart] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/api/createproduct");
        const productsData = Array.isArray(response.data)
          ? response.data
          : response.data.products || [];
        setProducts(productsData);
        setError(null);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleLogout = () => {
    const cookies = document.cookie.split(";");

    router.push("/signin");
  };

  const toggleDropdown = (productId: number) => {
    setOpenDropdown(openDropdown === productId ? null : productId);
    if (!quantities[productId]) {
      setQuantities({ ...quantities, [productId]: 1 });
    }
  };

  const handleQuantityChange = (productId: number, quantity: number) => {
    setQuantities({ ...quantities, [productId]: quantity });
  };

  const handleAddToCart = async (productId: number) => {
    const quantity = quantities[productId] || 1;
    setAddingToCart(productId);
    try {
      const response = await axios.post("/api/addtocart", {
        productId,
        quantity,
      });
      console.log(response.data.message);
    } catch (error) {
      console.error("Error adding product to cart:", error);
    } finally {
      setAddingToCart(null);
      setOpenDropdown(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold">E-Shop</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => {
                  setLoadingCart(true);
                  router.push("/cart");
                }}
                variant="ghost"
                size="icon"
                disabled={loadingCart}
              >
                {loadingCart ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <ShoppingCart className="h-5 w-5" />
                )}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Section */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-grow">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search products..."
                className="pl-10"
              />
            </div>
          </div>
          <div className="w-full sm:w-48">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category.toLowerCase()}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Featured Products */}
        <h2 className="text-2xl font-bold mb-6">Featured Products</h2>

        {loading ? (
          <div className="text-center py-8">Loading products...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : products.length === 0 ? (
          <div className="text-center py-8">No products found</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product.id}>
                <CardContent className="p-4">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-48 object-cover mb-4"
                  />
                  <CardTitle>{product.name}</CardTitle>
                  <p className="text-lg font-bold text-primary">
                    ${product.price}
                  </p>
                </CardContent>
                <CardFooter className="relative">
                  <Button
                    className="w-full"
                    onClick={() => toggleDropdown(product.id)}
                  >
                    Add to Cart
                  </Button>
                  {openDropdown === product.id && (
                    <div className="absolute bottom-full left-0 right-0 bg-white shadow-lg rounded-t-md p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">Select Quantity</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setOpenDropdown(null)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <Select
                          value={quantities[product.id]?.toString()}
                          onValueChange={(value) =>
                            setQuantities({
                              ...quantities,
                              [product.id]: parseInt(value, 10),
                            })
                          }
                        >
                          <SelectTrigger className="w-24">
                            <SelectValue placeholder="Quantity" />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5].map((num) => (
                              <SelectItem key={num} value={num.toString()}>
                                {num}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          onClick={() => handleAddToCart(product.id)}
                          disabled={addingToCart === product.id}
                        >
                          {addingToCart === product.id ? (
                            <span className="flex items-center">
                              <Loader2 className="animate-spin mr-2 h-4 w-4" />
                              Adding...
                            </span>
                          ) : (
                            "Add"
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>

      <footer className="bg-white shadow-md mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-500">
            &copy; 2023 E-Shop. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
