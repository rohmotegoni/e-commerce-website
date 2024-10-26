"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface CartItem {
  id: string;
  product: {
    name: string;
    price: number;
    image: string;
    imageUrl: string;
  };
  quantity: number;
}

export default function Component() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showCongrats, setShowCongrats] = useState<boolean>(false);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get("/api/cartitem");
        console.log("API Response:", response.data);
        setCartItems(response.data);
      } catch (err) {
        console.error("Error fetching cart items:", err);
        setError("Failed to load cart items.");
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const handleDelete = async (id: string) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
    const deleteitem = await axios.delete(`/api/deleteitem`, { data: { id } });
  };

  const calculateTotal = () => {
    return cartItems
      .reduce(
        (total, item) => total + (item.product.price || 0) * item.quantity,
        0
      )
      .toFixed(2);
  };

  const handleOrderNow = () => {
    console.log("Order placed");
    setShowCongrats(true);
    setTimeout(() => {
      setShowCongrats(false);
    }, 5000); // Hide the message after 5 seconds
  };

  if (loading) {
    return <p className="text-center">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      {showCongrats && (
        <Alert className="mb-4 bg-green-100 border-green-400">
          <AlertTitle>Congratulations!</AlertTitle>
          <AlertDescription>
            Your order has been placed successfully. Thank you for shopping with
            us!
          </AlertDescription>
        </Alert>
      )}
      {cartItems.length === 0 ? (
        <p className="text-center text-gray-500">Your cart is empty</p>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold">
                      {item.product.name}
                    </h2>
                    <p className="text-sm text-gray-500">
                      Quantity: {item.quantity}
                    </p>
                    <p className="text-sm font-medium">
                      ${item.product.price.toFixed(2)}
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(item.id)}
                    aria-label={`Delete ${item.product.name} from cart`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          <div className="flex justify-between items-center pt-4 border-t">
            <span className="text-xl font-bold">Total:</span>
            <span className="text-xl">${calculateTotal()}</span>
          </div>
          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={() => router.push("/user")}>
              Shop More
            </Button>
            <Button onClick={handleOrderNow}>Order Now</Button>
          </div>
        </div>
      )}
    </div>
  );
}
