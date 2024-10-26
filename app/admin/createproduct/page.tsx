"use client";
import { useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input"; // Assuming you have an Input component
import { Label } from "@/components/ui/label"; // Assuming you have a Label component
import { Textarea } from "@/components/ui/textarea"; // Assuming you have a Textarea component
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Assuming you have a Select component
import { Button } from "@/components/ui/button"; // Assuming you have a Button component
import axios from "axios";

// Product interface (adjust as needed)
interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  imageUrl?: string;
}

// Props for ProductForm component
interface ProductFormProps {
  product: Omit<Product, "_id">;
  setProduct: React.Dispatch<React.SetStateAction<Omit<Product, "_id">>>;
  onSubmit: () => void;
  submitText: string;
}

// CreateProduct Component
export default function CreateProduct() {
  const [newProduct, setNewProduct] = useState<Omit<Product, "_id">>({
    name: "",
    description: "",
    price: 0,
    category: "",
    stock: 0,
    imageUrl: "",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCreateProduct = async () => {
    toast.success("Product created!");
    setIsDialogOpen(false); // Close the dialog after submission
    let product = await axios.post(`/api/createproduct`, newProduct);
    return product;
  };

  return (
    <div className="container mx-auto p-4">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold mb-6">Create Product</h1>
      <Button onClick={() => setIsDialogOpen(true)}>Add New Product</Button>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
          </DialogHeader>
          <ProductForm
            product={newProduct}
            setProduct={setNewProduct}
            onSubmit={handleCreateProduct}
            submitText="Create Product"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ProductForm Component
function ProductForm({
  product,
  setProduct,
  onSubmit,
  submitText,
}: ProductFormProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="space-y-4"
    >
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={product.name}
          onChange={(e) => setProduct({ ...product, name: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={product.description}
          onChange={(e) =>
            setProduct({ ...product, description: e.target.value })
          }
          required
        />
      </div>
      <div>
        <Label htmlFor="price">Price</Label>
        <Input
          id="price"
          type="number"
          value={product.price}
          onChange={(e) =>
            setProduct({ ...product, price: parseFloat(e.target.value) })
          }
          required
        />
      </div>
      <div>
        <Label htmlFor="category">Category</Label>
        <Select
          value={product.category}
          onValueChange={(value) => setProduct({ ...product, category: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="electronics">Electronics</SelectItem>
            <SelectItem value="clothing">Clothing</SelectItem>
            <SelectItem value="books">Books</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="stock">Stock</Label>
        <Input
          id="stock"
          type="number"
          value={product.stock}
          onChange={(e) =>
            setProduct({ ...product, stock: parseInt(e.target.value) })
          }
          required
        />
      </div>
      <div>
        <Label htmlFor="imageUrl">Image URL</Label>
        <Input
          id="imageUrl"
          value={product.imageUrl}
          onChange={(e) => setProduct({ ...product, imageUrl: e.target.value })}
        />
      </div>
      <Button type="submit">{submitText}</Button>
    </form>
  );
}
