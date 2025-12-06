import { useState } from 'react'
import api from '../../services/api'
import ImageUpload from '../../components/ImageUpload'

export default function AddProduct() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'FOOD',
    price: '',
    discountPrice: '',
    stock: '',
    images: [] as string[],
    specifications: {
      brand: '',
      weight: '',
      size: '',
      material: '',
      ageGroup: '',
      petType: [] as string[],
      breedSize: '',
      foodType: '',
      ingredients: '',
      usageInstructions: ''
    },
    subscriptionAvailable: false,
    subscriptionDiscount: '',
    tags: ''
  })

  const categories = [
    { value: 'FOOD', label: 'Pet Food' },
    { value: 'TOYS', label: 'Toys' },
    { value: 'ACCESSORIES', label: 'Accessories' },
    { value: 'GROOMING', label: 'Grooming' },
    { value: 'HEALTH', label: 'Health & Wellness' },
    { value: 'TRAINING', label: 'Training' }
  ]

  const petTypes = ['Dog', 'Cat', 'Bird', 'Rabbit', 'Fish', 'Other']

  const handlePetTypeToggle = (type: string) => {
    const current = formData.specifications.petType
    if (current.includes(type)) {
      setFormData({
        ...formData,
        specifications: {
          ...formData.specifications,
          petType: current.filter(t => t !== type)
        }
      })
    } else {
      setFormData({
        ...formData,
        specifications: {
          ...formData.specifications,
          petType: [...current, type]
        }
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const productData = {
        ...formData,
        price: Number(formData.price),
        discountPrice: formData.discountPrice ? Number(formData.discountPrice) : undefined,
        stock: Number(formData.stock),
        subscriptionDiscount: formData.subscriptionDiscount ? Number(formData.subscriptionDiscount) : undefined,
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t)
      }

      await api.post('/store/products', productData)
      alert('✅ Product added successfully!')
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        category: 'FOOD',
        price: '',
        discountPrice: '',
        stock: '',
        images: [],
        specifications: {
          brand: '',
          weight: '',
          size: '',
          material: '',
          ageGroup: '',
          petType: [],
          breedSize: '',
          foodType: '',
          ingredients: '',
          usageInstructions: ''
        },
        subscriptionAvailable: false,
        subscriptionDiscount: '',
        tags: ''
      })
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to add product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="add-product-container">
      <h2>Add New Product</h2>
      
      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-section">
          <h3>Basic Information</h3>
          
          <div className="form-group">
            <label>Product Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Drools Chicken & Rice Adult Dog Food"
              required
            />
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detailed product description..."
              rows={4}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Brand</label>
              <input
                type="text"
                value={formData.specifications.brand}
                onChange={(e) => setFormData({
                  ...formData,
                  specifications: { ...formData.specifications, brand: e.target.value }
                })}
                placeholder="Brand name"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Pricing & Stock</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label>Price (₹) *</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="999"
                required
                min="0"
              />
            </div>

            <div className="form-group">
              <label>Discount Price (₹)</label>
              <input
                type="number"
                value={formData.discountPrice}
                onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                placeholder="799"
                min="0"
              />
            </div>

            <div className="form-group">
              <label>Stock Quantity *</label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                placeholder="50"
                required
                min="0"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Product Images</h3>
          <ImageUpload
            onUploadComplete={(url) => {
              setFormData({ ...formData, images: [...formData.images, url] })
            }}
            folder="products"
            maxFiles={5}
            currentImages={formData.images}
          />
          {formData.images.length > 0 && (
            <div className="uploaded-images">
              {formData.images.map((img, idx) => (
                <div key={idx} className="uploaded-image">
                  <img src={img} alt={`Product ${idx + 1}`} />
                  <button
                    type="button"
                    className="remove-image"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        images: formData.images.filter((_, i) => i !== idx)
                      })
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="form-section">
          <h3>Specifications</h3>
          
          <div className="form-group">
            <label>Pet Type</label>
            <div className="checkbox-group">
              {petTypes.map(type => (
                <label key={type} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.specifications.petType.includes(type)}
                    onChange={() => handlePetTypeToggle(type)}
                  />
                  {type}
                </label>
              ))}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Weight/Size</label>
              <input
                type="text"
                value={formData.specifications.weight}
                onChange={(e) => setFormData({
                  ...formData,
                  specifications: { ...formData.specifications, weight: e.target.value }
                })}
                placeholder="e.g., 3kg, 500ml"
              />
            </div>

            <div className="form-group">
              <label>Age Group</label>
              <select
                value={formData.specifications.ageGroup}
                onChange={(e) => setFormData({
                  ...formData,
                  specifications: { ...formData.specifications, ageGroup: e.target.value }
                })}
              >
                <option value="">Select...</option>
                <option value="Puppy">Puppy/Kitten</option>
                <option value="Adult">Adult</option>
                <option value="Senior">Senior</option>
              </select>
            </div>
          </div>

          {formData.category === 'FOOD' && (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label>Food Type</label>
                  <select
                    value={formData.specifications.foodType}
                    onChange={(e) => setFormData({
                      ...formData,
                      specifications: { ...formData.specifications, foodType: e.target.value }
                    })}
                  >
                    <option value="">Select...</option>
                    <option value="Dry">Dry</option>
                    <option value="Wet">Wet</option>
                    <option value="Grain-free">Grain-free</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Breed Size</label>
                  <select
                    value={formData.specifications.breedSize}
                    onChange={(e) => setFormData({
                      ...formData,
                      specifications: { ...formData.specifications, breedSize: e.target.value }
                    })}
                  >
                    <option value="">Select...</option>
                    <option value="Small">Small</option>
                    <option value="Medium">Medium</option>
                    <option value="Large">Large</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Ingredients</label>
                <textarea
                  value={formData.specifications.ingredients}
                  onChange={(e) => setFormData({
                    ...formData,
                    specifications: { ...formData.specifications, ingredients: e.target.value }
                  })}
                  placeholder="List main ingredients..."
                  rows={3}
                />
              </div>
            </>
          )}

          {formData.category === 'TOYS' && (
            <div className="form-group">
              <label>Material</label>
              <select
                value={formData.specifications.material}
                onChange={(e) => setFormData({
                  ...formData,
                  specifications: { ...formData.specifications, material: e.target.value }
                })}
              >
                <option value="">Select...</option>
                <option value="Rubber">Rubber</option>
                <option value="Foam">Foam</option>
                <option value="Rope">Rope</option>
                <option value="Plush">Plush</option>
              </select>
            </div>
          )}

          <div className="form-group">
            <label>Usage Instructions</label>
            <textarea
              value={formData.specifications.usageInstructions}
              onChange={(e) => setFormData({
                ...formData,
                specifications: { ...formData.specifications, usageInstructions: e.target.value }
              })}
              placeholder="How to use this product..."
              rows={3}
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Additional Options</h3>
          
          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.subscriptionAvailable}
                onChange={(e) => setFormData({ ...formData, subscriptionAvailable: e.target.checked })}
              />
              Enable Subscription (Recurring Orders)
            </label>
          </div>

          {formData.subscriptionAvailable && (
            <div className="form-group">
              <label>Subscription Discount (%)</label>
              <input
                type="number"
                value={formData.subscriptionDiscount}
                onChange={(e) => setFormData({ ...formData, subscriptionDiscount: e.target.value })}
                placeholder="10"
                min="0"
                max="100"
              />
            </div>
          )}

          <div className="form-group">
            <label>Tags (comma-separated)</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="dog, food, chicken, adult"
            />
          </div>
        </div>

        <button 
          type="submit" 
          className="btn btn-primary btn-large"
          disabled={loading}
        >
          {loading ? 'Adding Product...' : '✅ Add Product'}
        </button>
      </form>
    </div>
  )
}
