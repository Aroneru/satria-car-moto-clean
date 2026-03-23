'use client';
import { useState } from 'react';
import { Plus, Edit2, Trash2, X, Car, Bike } from 'lucide-react';
import { useContent } from '../../context/ContentContext';

export function ServicesManager() {
  const { services, setServices } = useContent();
  const [isEditing, setIsEditing] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [filterTab, setFilterTab] = useState<'all' | 'car' | 'motor'>('all');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    features: '',
    priceSmall: '',
    priceMedium: '',
    priceLarge: '',
    priceExtraLarge: '',
    priceMotorcycleStandard: '',
    priceMotorcycleMoge: '',
    priceMotorcycleExtraLarge: '',
    duration: '',
  });

  const handleEdit = (service: any) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      description: service.description,
      features: service.features.join('\n'),
      priceSmall: service.priceMatrix.small?.toString() || '',
      priceMedium: service.priceMatrix.medium?.toString() || '',
      priceLarge: service.priceMatrix.large?.toString() || '',
      priceExtraLarge: service.priceMatrix.extraLarge?.toString() || '',
      priceMotorcycleStandard: service.priceMatrix.motorcycleStandard?.toString() || '',
      priceMotorcycleMoge: service.priceMatrix.motorcycleMoge?.toString() || '',
      priceMotorcycleExtraLarge: service.priceMatrix.motorcycleExtraLarge?.toString() || '',
      duration: service.duration,
    });
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this service?')) {
      setServices(services.filter((s) => s.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const serviceData = {
      id: editingService?.id || Date.now().toString(),
      icon: 'Briefcase',
      title: formData.title,
      description: formData.description,
      features: formData.features.split('\n').filter((f) => f.trim()),
      priceMatrix: {
        small: formData.priceSmall ? parseInt(formData.priceSmall) : undefined,
        medium: formData.priceMedium ? parseInt(formData.priceMedium) : undefined,
        large: formData.priceLarge ? parseInt(formData.priceLarge) : undefined,
        extraLarge: formData.priceExtraLarge ? parseInt(formData.priceExtraLarge) : undefined,
        motorcycleStandard: formData.priceMotorcycleStandard ? parseInt(formData.priceMotorcycleStandard) : undefined,
        motorcycleMoge: formData.priceMotorcycleMoge ? parseInt(formData.priceMotorcycleMoge) : undefined,
        motorcycleExtraLarge: formData.priceMotorcycleExtraLarge ? parseInt(formData.priceMotorcycleExtraLarge) : undefined,
      },
      duration: formData.duration,
    };

    if (editingService) {
      setServices(services.map((s) => (s.id === editingService.id ? serviceData : s)));
    } else {
      setServices([...services, serviceData]);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      features: '',
      priceSmall: '',
      priceMedium: '',
      priceLarge: '',
      priceExtraLarge: '',
      priceMotorcycleStandard: '',
      priceMotorcycleMoge: '',
      priceMotorcycleExtraLarge: '',
      duration: '',
    });
    setIsEditing(false);
    setEditingService(null);
  };

  // Get price range for display
  const getPriceRange = (priceMatrix: any) => {
    const prices = [
      priceMatrix.small,
      priceMatrix.medium,
      priceMatrix.large,
      priceMatrix.extraLarge,
      priceMatrix.motorcycleStandard,
      priceMatrix.motorcycleMoge,
      priceMatrix.motorcycleExtraLarge,
    ].filter((p) => p !== undefined);

    if (prices.length === 0) return 'No price set';
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    
    if (min === max) return `Rp ${min.toLocaleString()}`;
    return `Rp ${min.toLocaleString()} - Rp ${max.toLocaleString()}`;
  };

  // Filter services
  const filteredServices = services.filter((service) => {
    if (filterTab === 'all') return true;
    if (filterTab === 'car') {
      return service.priceMatrix.small || service.priceMatrix.medium || 
             service.priceMatrix.large || service.priceMatrix.extraLarge;
    }
    if (filterTab === 'motor') {
      return service.priceMatrix.motorcycleStandard !== undefined ||
             service.priceMatrix.motorcycleMoge !== undefined ||
             service.priceMatrix.motorcycleExtraLarge !== undefined;
    }
    return true;
  });

  // Category colors
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Basic': 'bg-gray-100 text-gray-700 border-gray-300',
      'Standard': 'bg-blue-50 text-blue-700 border-blue-200',
      'Premium': 'bg-purple-50 text-purple-700 border-purple-200',
      'Luxury': 'bg-yellow-50 text-yellow-700 border-yellow-300',
      'Auto Detailing': 'bg-[#6797BF] bg-opacity-20 text-[#6797BF] border-[#6797BF]',
      'Coating': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    };
    return colors[category] || 'bg-gray-100 text-gray-700 border-gray-300';
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-2xl font-bold text-[#1D1D1D] mb-1">Service Price List</h3>
          <p className="text-gray-600">Manage your service offerings and pricing</p>
        </div>
        <button
          onClick={() => setIsEditing(true)}
          className="flex items-center gap-2 bg-[#FCDE04] text-[#1D1D1D] px-6 py-3 rounded-lg font-bold hover:bg-[#e8cd04] transition-colors shadow-md"
        >
          <Plus className="w-5 h-5" />
          Add New Service
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 mb-6 border-b border-[#D1D5DC]">
        <button
          onClick={() => setFilterTab('all')}
          className={`px-6 py-3 font-semibold transition-colors relative ${
            filterTab === 'all' ? 'text-[#1D1D1D]' : 'text-gray-500'
          }`}
        >
          All Services
          {filterTab === 'all' && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#FCDE04] rounded-t-full"></div>
          )}
        </button>
        <button
          onClick={() => setFilterTab('car')}
          className={`px-6 py-3 font-semibold transition-colors relative flex items-center gap-2 ${
            filterTab === 'car' ? 'text-[#1D1D1D]' : 'text-gray-500'
          }`}
        >
          <Car className="w-4 h-4" />
          Car Only
          {filterTab === 'car' && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#FCDE04] rounded-t-full"></div>
          )}
        </button>
        <button
          onClick={() => setFilterTab('motor')}
          className={`px-6 py-3 font-semibold transition-colors relative flex items-center gap-2 ${
            filterTab === 'motor' ? 'text-[#1D1D1D]' : 'text-gray-500'
          }`}
        >
          <Bike className="w-4 h-4" />
          Motor Only
          {filterTab === 'motor' && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#FCDE04] rounded-t-full"></div>
          )}
        </button>
      </div>

      {/* Services List */}
      <div className="space-y-4">
        {filteredServices.length === 0 ? (
          <div className="bg-white p-12 rounded-xl shadow-sm border border-[#D1D5DC] text-center">
            <p className="text-gray-500">No services found</p>
          </div>
        ) : (
          filteredServices.map((service) => (
            <div
              key={service.id}
              className="bg-white p-6 rounded-xl shadow-sm border border-[#D1D5DC] hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-[#1D1D1D] mb-2">{service.title}</h3>

                  <p className="text-gray-600 text-sm mb-3">{service.description}</p>

                  <div className="flex items-center gap-4 text-sm mb-3">
                    <span className="text-gray-500">
                      <strong className="text-gray-700">Duration:</strong> {service.duration}
                    </span>
                    <span className="text-gray-400">|</span>
                    <span className="text-gray-500">
                      <strong className="text-gray-700">Price Range:</strong>{' '}
                      <span className="text-[#6797BF] font-semibold">{getPriceRange(service.priceMatrix)}</span>
                    </span>
                  </div>

                  {/* Price Details */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-3 border-t border-gray-100">
                    {service.priceMatrix.small && (
                      <div className="text-center">
                        <p className="text-xs text-gray-500 mb-1">Small Car</p>
                        <p className="font-semibold text-[#1D1D1D] text-sm">
                          Rp {service.priceMatrix.small.toLocaleString()}
                        </p>
                      </div>
                    )}
                    {service.priceMatrix.medium && (
                      <div className="text-center">
                        <p className="text-xs text-gray-500 mb-1">Medium Car</p>
                        <p className="font-semibold text-[#1D1D1D] text-sm">
                          Rp {service.priceMatrix.medium.toLocaleString()}
                        </p>
                      </div>
                    )}
                    {service.priceMatrix.large && (
                      <div className="text-center">
                        <p className="text-xs text-gray-500 mb-1">Large Car</p>
                        <p className="font-semibold text-[#1D1D1D] text-sm">
                          Rp {service.priceMatrix.large.toLocaleString()}
                        </p>
                      </div>
                    )}
                    {service.priceMatrix.extraLarge && (
                      <div className="text-center">
                        <p className="text-xs text-gray-500 mb-1">Extra Large</p>
                        <p className="font-semibold text-[#1D1D1D] text-sm">
                          Rp {service.priceMatrix.extraLarge.toLocaleString()}
                        </p>
                      </div>
                    )}
                    {service.priceMatrix.motorcycleStandard && (
                      <div className="text-center">
                        <p className="text-xs text-gray-500 mb-1">Motorcycle Standard</p>
                        <p className="font-semibold text-[#1D1D1D] text-sm">
                          Rp {service.priceMatrix.motorcycleStandard.toLocaleString()}
                        </p>
                      </div>
                    )}
                    {service.priceMatrix.motorcycleMoge && (
                      <div className="text-center">
                        <p className="text-xs text-gray-500 mb-1">Motorcycle Moge</p>
                        <p className="font-semibold text-[#1D1D1D] text-sm">
                          Rp {service.priceMatrix.motorcycleMoge.toLocaleString()}
                        </p>
                      </div>
                    )}
                    {service.priceMatrix.motorcycleExtraLarge && (
                      <div className="text-center">
                        <p className="text-xs text-gray-500 mb-1">Motorcycle Extra Large</p>
                        <p className="font-semibold text-[#1D1D1D] text-sm">
                          Rp {service.priceMatrix.motorcycleExtraLarge.toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(service)}
                    className="p-3 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
                    className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit/Add Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-6 border-b border-[#D1D5DC] flex justify-between items-center">
              <h3 className="text-2xl font-bold text-[#1D1D1D]">
                {editingService ? `Edit Service: ${editingService.title}` : 'Add New Service'}
              </h3>
              <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Basic Information */}
              <div>
                <h4 className="font-bold text-[#1D1D1D] mb-4 text-lg">Basic Information</h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#1D1D1D] mb-2">
                      Service Name *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-[#D1D5DC] rounded-lg focus:outline-none focus:border-[#FCDE04] focus:ring-2 focus:ring-[#FCDE04] focus:ring-opacity-20"
                      placeholder="e.g., Nano Ceramic Coating"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#1D1D1D] mb-2">
                      Description *
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required
                      rows={3}
                      className="w-full px-4 py-2 border border-[#D1D5DC] rounded-lg focus:outline-none focus:border-[#FCDE04] focus:ring-2 focus:ring-[#FCDE04] focus:ring-opacity-20"
                      placeholder="Brief description of the service"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#1D1D1D] mb-2">
                      Features (one per line) *
                    </label>
                    <textarea
                      value={formData.features}
                      onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                      required
                      rows={5}
                      className="w-full px-4 py-2 border border-[#D1D5DC] rounded-lg focus:outline-none focus:border-[#FCDE04] focus:ring-2 focus:ring-[#FCDE04] focus:ring-opacity-20"
                      placeholder="Full exterior wash&#10;Interior cleaning&#10;Dashboard polish"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#1D1D1D] mb-2">
                      Duration *
                    </label>
                    <input
                      type="text"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-[#D1D5DC] rounded-lg focus:outline-none focus:border-[#FCDE04] focus:ring-2 focus:ring-[#FCDE04] focus:ring-opacity-20"
                      placeholder="e.g., 30-40 minutes"
                    />
                  </div>
                </div>
              </div>

              {/* Price Matrix Section */}
              <div className="bg-gray-50 p-6 rounded-lg border border-[#D1D5DC]">
                <h4 className="font-bold text-[#1D1D1D] mb-4 text-lg">Set Prices by Vehicle Size</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Enter prices for different vehicle sizes. Leave blank if not applicable.
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#1D1D1D] mb-2">
                      Small (Agya/Brio)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">Rp</span>
                      <input
                        type="number"
                        value={formData.priceSmall}
                        onChange={(e) => setFormData({ ...formData, priceSmall: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 border border-[#D1D5DC] rounded-lg focus:outline-none focus:border-[#FCDE04] focus:ring-2 focus:ring-[#FCDE04] focus:ring-opacity-20"
                        placeholder="0"
                        min="0"
                        step="1000"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#1D1D1D] mb-2">
                      Medium (Avanza/HRV)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">Rp</span>
                      <input
                        type="number"
                        value={formData.priceMedium}
                        onChange={(e) => setFormData({ ...formData, priceMedium: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 border border-[#D1D5DC] rounded-lg focus:outline-none focus:border-[#FCDE04] focus:ring-2 focus:ring-[#FCDE04] focus:ring-opacity-20"
                        placeholder="0"
                        min="0"
                        step="1000"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#1D1D1D] mb-2">
                      Large (Pajero/Innova)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">Rp</span>
                      <input
                        type="number"
                        value={formData.priceLarge}
                        onChange={(e) => setFormData({ ...formData, priceLarge: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 border border-[#D1D5DC] rounded-lg focus:outline-none focus:border-[#FCDE04] focus:ring-2 focus:ring-[#FCDE04] focus:ring-opacity-20"
                        placeholder="0"
                        min="0"
                        step="1000"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#1D1D1D] mb-2">
                      Extra Large (Alphard/Fortuner)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">Rp</span>
                      <input
                        type="number"
                        value={formData.priceExtraLarge}
                        onChange={(e) => setFormData({ ...formData, priceExtraLarge: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 border border-[#D1D5DC] rounded-lg focus:outline-none focus:border-[#FCDE04] focus:ring-2 focus:ring-[#FCDE04] focus:ring-opacity-20"
                        placeholder="0"
                        min="0"
                        step="1000"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#1D1D1D] mb-2">
                      Motor Standard (Beat/Vario)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">Rp</span>
                      <input
                        type="number"
                        value={formData.priceMotorcycleStandard}
                        onChange={(e) => setFormData({ ...formData, priceMotorcycleStandard: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 border border-[#D1D5DC] rounded-lg focus:outline-none focus:border-[#FCDE04] focus:ring-2 focus:ring-[#FCDE04] focus:ring-opacity-20"
                        placeholder="0"
                        min="0"
                        step="1000"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#1D1D1D] mb-2">
                      Moge (NMAX/PCX/Ninja)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">Rp</span>
                      <input
                        type="number"
                        value={formData.priceMotorcycleMoge}
                        onChange={(e) => setFormData({ ...formData, priceMotorcycleMoge: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 border border-[#D1D5DC] rounded-lg focus:outline-none focus:border-[#FCDE04] focus:ring-2 focus:ring-[#FCDE04] focus:ring-opacity-20"
                        placeholder="0"
                        min="0"
                        step="1000"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#1D1D1D] mb-2">
                      Extra Large (Harley/XMax)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">Rp</span>
                      <input
                        type="number"
                        value={formData.priceMotorcycleExtraLarge}
                        onChange={(e) => setFormData({ ...formData, priceMotorcycleExtraLarge: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 border border-[#D1D5DC] rounded-lg focus:outline-none focus:border-[#FCDE04] focus:ring-2 focus:ring-[#FCDE04] focus:ring-opacity-20"
                        placeholder="0"
                        min="0"
                        step="1000"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex gap-4 pt-4 border-t border-[#D1D5DC]">
                <button
                  type="submit"
                  className="flex-1 bg-[#FCDE04] text-[#1D1D1D] px-6 py-3 rounded-lg font-bold hover:bg-[#e8cd04] transition-colors shadow-md"
                >
                  {editingService ? 'Save Changes' : 'Add Service'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 bg-white border-2 border-[#D1D5DC] rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}