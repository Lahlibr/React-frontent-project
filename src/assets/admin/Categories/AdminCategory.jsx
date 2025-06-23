import React, { useEffect, useState } from 'react';
import axiosInstance from '../../components/AxiosInstance';
import { Card, CardContent } from './card';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from './dialog';

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: null,
  });
  const [editCategory, setEditCategory] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await axiosInstance.get('/Category/All');
      setCategories(res.data);
    } catch (err) {
      console.error('Error fetching categories', err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async () => {
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      if (formData.image) {
        data.append('image', formData.image);
      }

      if (editCategory) {
        await axiosInstance.put(`/Category/Update/${editCategory.categoryId}`, data);
      } else {
        await axiosInstance.post('/Category/Add', data);
      }

      setFormData({ name: '', description: '', image: null });
      setEditCategory(null);
      setIsAddDialogOpen(false);
      setIsEditDialogOpen(false);
      fetchCategories();
    } catch (err) {
      console.error('Failed to submit category', err);
    }
  };

  const openAddDialog = () => {
    setEditCategory(null);
    setFormData({ name: '', description: '', image: null });
    setIsAddDialogOpen(true);
  };

  const openEditDialog = (category) => {
    setEditCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      image: null,
    });
    setIsEditDialogOpen(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Categories</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog}>Add Category</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogTitle>Add Category</DialogTitle>
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Category Name"
              />
              <Label>Description</Label>
              <Input
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Short description"
              />
              <Label>Image</Label>
              <Input type="file" onChange={handleFileChange} />
              <Button onClick={handleSubmit} className="mt-4 w-full">
                Add Category
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {Array.isArray(categories) &&
          categories.map((category) => (
            <Card key={category.categoryId} className="shadow-xl">
              <img
                src={category.imageUrl}
                alt={category.name}
                className="w-full h-40 object-cover rounded-t-lg"
              />
              <CardContent className="p-4">
                <h2 className="text-xl font-semibold">{category.name}</h2>
                <p className="text-gray-600 text-sm mb-4">
                  {category.description}
                </p>
                <div className="flex justify-end">
                  <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        className="mr-2"
                        onClick={() => openEditDialog(category)}
                      >
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogTitle>Edit Category</DialogTitle>
                      <div className="space-y-2">
                        <Label>Name</Label>
                        <Input
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Category Name"
                        />
                        <Label>Description</Label>
                        <Input
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          placeholder="Short description"
                        />
                        <Label>Image</Label>
                        <Input type="file" onChange={handleFileChange} />
                        <Button onClick={handleSubmit} className="mt-4 w-full">
                          Update Category
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
};

export default CategoryPage;