import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import axiosInstance from "../../components/AxiosInstance";
import { normalizeProduct } from "../../components/Normalize";

// Inline Skeleton component
const Skeleton = ({ className = "" }) => {
  return <div className={`bg-gray-200 animate-pulse rounded ${className}`} />;
};

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axiosInstance.get(`/Product/${id}`);
        const normalized = normalizeProduct(response.data);
        setProduct(normalized);
        setIsWishlisted(normalized.wishlisted ?? false);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product:", error);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  return (
    <div className="min-h-screen p-4 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      {loading ? (
        <div className="flex flex-col gap-5 lg:flex-row items-center lg:items-start justify-center p-4">
          <Skeleton className="w-[300px] h-[300px]" />
          <div className="flex flex-col gap-2">
            <Skeleton className="w-[200px] h-6" />
            <Skeleton className="w-[100px] h-4" />
            <Skeleton className="w-[250px] h-6" />
            <Skeleton className="w-[150px] h-4" />
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-5 lg:flex-row items-center lg:items-start">
          {/* Product image */}
          <div className="w-full lg:w-1/2 flex flex-col items-center">
            <img
              src={product.images?.[selectedImage]}
              alt={product.title}
              className="w-full max-w-[500px] h-auto rounded"
            />
            <div className="flex gap-3 mt-4 overflow-x-auto max-w-full">
              {product.images?.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Product ${index}`}
                  className={`w-20 h-20 object-cover rounded cursor-pointer border-2 ${
                    selectedImage === index
                      ? "border-blue-500"
                      : "border-transparent"
                  }`}
                  onClick={() => setSelectedImage(index)}
                />
              ))}
            </div>
          </div>

          {/* Product details */}
          <div className="w-full lg:w-1/2 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">{product.title}</h2>
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="text-red-500 text-xl"
              >
                {isWishlisted ? <FaHeart /> : <FaRegHeart />}
              </button>
            </div>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              {product.description}
            </p>
            <div className="text-lg space-y-1">
              <p className="text-gray-900 dark:text-white">
                Price: ₹{product.offerPrice}
              </p>
              <p className="line-through text-gray-500">
                MRP: ₹{product.price}
              </p>
              <p className="text-green-600">
                Save {Math.round(
                  ((product.price - product.offerPrice) / product.price) * 100
                )}
                %
              </p>
            </div>
            <div className="flex items-center gap-4">
              <label htmlFor="quantity">Quantity:</label>
              <input
                type="number"
                id="quantity"
                className="w-20 p-2 border rounded bg-white dark:bg-gray-800"
                value={quantity}
                min="1"
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
            </div>
            <div className="flex gap-4 mt-4">
              <button
                onClick={() => navigate("/cart")}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Add to Cart
              </button>
              <button
                onClick={() => navigate("/checkout")}
                className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;