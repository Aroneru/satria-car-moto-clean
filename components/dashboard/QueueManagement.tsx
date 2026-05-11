'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Car, Bike, Search, Plus, Edit2, Trash2, Clock, CheckCircle, XCircle, Play, ArrowLeft } from 'lucide-react';
import { useContent } from '@/context/ContentContext';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';

// Vehicle model database for auto-detection
const vehicleDatabase = {
  car: {
    small: ['Agya', 'Ayla', 'Brio', 'Yaris', 'March', 'Mirage', 'Picanto', 'Spark', 'Karimun', 'Ignis'],
    medium: ['Avanza', 'Xenia', 'HRV', 'Jazz', 'Swift', 'Ertiga', 'Mobilio', 'Livina', 'Baleno', 'Rush', 'Sienta', 'Xpander', 'Rush', ],
    large: ['Pajero', 'Fortuner', 'Innova', 'CRV', 'Xpander', 'Terios', 'X-Trail', 'Outlander', 'BRV', 'Nissan Long', 'Luxio', 'Serena', 'Terrano'],
    extraLarge: ['Alphard', 'Vellfire', 'Land Cruiser', 'Expedition', 'Hilux', 'Ranger', 'Navara', 'Triton', 'Pajero Sport'],
  },
  motorcycle: {
    motorcycleStandard: ['Beat', 'Vario', 'Scoopy', 'Mio', 'Fino', 'Genio', 'Freego'],
    motorcycleMoge: ['NMAX', 'PCX', 'ADV', 'Aerox', 'Lexi', 'Forza', 'Ninja'],
    motorcycleExtraLarge: ['Harley', 'Davidson', 'Goldwing', 'XMax', 'Xmax'],
  },
};

type QueueStatus = 'waiting' | 'in-progress' | 'completed' | 'cancelled';

type QueueItem = {
  id: string;
  queueNumber: string;
  customerName: string;
  phoneNumber: string;
  vehicleType: 'car' | 'motorcycle';
  vehiclePlate: string;
  serviceId: string;
  serviceName: string;
  price: number;
  status: QueueStatus;
  createdAt: Date;
  completedAt?: Date;
  notes?: string;
  paid?: boolean;
};

type QueueGroup = {
  customerName: string;
  phoneNumber: string;
  vehicleType: 'car' | 'motorcycle';
  vehiclePlate: string;
  services: QueueItem[];
};

export function QueueManagement() {
  const router = useRouter();
  const { services, queueItems, setQueueItems, transactions, setTransactions } = useContent();
  
  // View state - 'list' or 'create'
  const [viewMode, setViewMode] = useState<'list' | 'create'>('list');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterDate, setFilterDate] = useState<'all' | 'today' | 'week'>('all');
  
  // Form state
  const [vehicleType, setVehicleType] = useState<'car' | 'motorcycle'>('car');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSize, setSelectedSize] = useState<string>('small');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'item' | 'group'; value: string } | null>(null);

  // Auto-detect vehicle size based on search query
  useEffect(() => {
    if (!searchQuery.trim()) return;

    const query = searchQuery.toLowerCase();
    const db = vehicleDatabase[vehicleType];

    for (const [size, models] of Object.entries(db)) {
      if (models.some((model: string) => query.includes(model.toLowerCase()))) {
        setSelectedSize(size);
        break;
      }
    }
  }, [searchQuery, vehicleType]);

  // Get available services based on vehicle type
  const getAvailableServices = () => {
    return services.filter((service) => {
      if (vehicleType === 'motorcycle') {
        return service.priceMatrix.motorcycleStandard !== undefined ||
               service.priceMatrix.motorcycleMoge !== undefined ||
               service.priceMatrix.motorcycleExtraLarge !== undefined;
      } else {
        return service.priceMatrix.small || service.priceMatrix.medium || 
               service.priceMatrix.large || service.priceMatrix.extraLarge;
      }
    });
  };

  // Get price for a service based on current selection
  const getServicePrice = (service: any) => {
    const sizeKey = selectedSize as keyof typeof service.priceMatrix;
    return service.priceMatrix[sizeKey] || 0;
  };

  // Calculate total
  const calculateTotal = () => {
    return selectedServices.reduce((total, serviceId) => {
      const service = services.find((s) => s.id === serviceId);
      if (service) {
        return total + getServicePrice(service);
      }
      return total;
    }, 0);
  };

  // Toggle service selection
  const toggleService = (serviceId: string) => {
    if (selectedServices.includes(serviceId)) {
      setSelectedServices(selectedServices.filter((id) => id !== serviceId));
    } else {
      setSelectedServices([...selectedServices, serviceId]);
    }
  };

  // Get queue number
  const getQueueNumber = () => {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0].replace(/-/g, '');
    const todayQueues = queueItems.filter(
      (q) => q.createdAt.toISOString().split('T')[0] === today.toISOString().split('T')[0]
    );
    const nextNum = todayQueues.length + 1;
    return `Q${dateStr}-${String(nextNum).padStart(3, '0')}`;
  };

  // Handle order submission
  const handleProcessOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedServices.length === 0) {
      alert('Please select at least one service');
      return;
    }

    // Create queue items for each selected service
    selectedServices.forEach((serviceId) => {
      const service = services.find((s) => s.id === serviceId);
      if (!service) return;

      const price = getServicePrice(service);

      const queueData = {
        id: crypto.randomUUID(),
        queueNumber: getQueueNumber(),
        customerName,
        phoneNumber,
        vehicleType,
        vehiclePlate: vehiclePlate.toUpperCase(),
        serviceId,
        serviceName: service.title,
        price,
        status: 'waiting' as const,
        createdAt: new Date(),
        paid: false,
        notes: '',
      };

      setQueueItems([...queueItems, queueData]);
    });

    // Reset form
    setSearchQuery('');
    setSelectedServices([]);
    setVehiclePlate('');
    setCustomerName('');
    setPhoneNumber('');
    setSelectedSize('small');

    alert('Order processed successfully!');
    
    // Redirect to queue list page
    router.push('/dashboard/queue');
  };

  // Get size options based on vehicle type
  const getSizeOptions = () => {
    if (vehicleType === 'car') {
      return [
        { value: 'small', label: 'Small', example: 'Yaris/Brio' },
        { value: 'medium', label: 'Medium', example: 'Avanza/HRV' },
        { value: 'large', label: 'Large', example: 'Pajero/Fortuner' },
        { value: 'extraLarge', label: 'Extra Large', example: 'Alphard' },
      ];
    } else {
      return [
        { value: 'motorcycleStandard', label: 'Motor Standard', example: 'Beat/Vario' },
        { value: 'motorcycleMoge', label: 'Moge', example: 'NMAX/PCX' },
        { value: 'motorcycleExtraLarge', label: 'Extra Large', example: 'Harley' },
      ];
    }
  };

  // Get display name for vehicle
  const getVehicleDisplayName = () => {
    if (!searchQuery.trim()) return 'Select Vehicle';
    
    const sizeOption = getSizeOptions().find((opt) => opt.value === selectedSize);
    return `${searchQuery} (${sizeOption?.label || 'Unknown'})`;
  };

  // Handle status change
  const handleStatusChange = (queueId: string, newStatus: QueueStatus) => {
    const queue = queueItems.find((q) => q.id === queueId);
    if (!queue) return;

    const alreadyPaid = transactions.some((t) => t.queueId === queue.id && t.type === 'income');

    const shouldCreateIncome = newStatus === 'in-progress' && queue.status !== 'in-progress' && !alreadyPaid && !queue.paid;

    const updatedQueue = {
      ...queue,
      status: newStatus,
      completedAt: newStatus === 'completed' ? new Date() : queue.completedAt,
      paid: shouldCreateIncome ? true : queue.paid,
    };

    // apply a single state update to avoid overwriting with stale closure values
    const newQueues = queueItems.map((q) => (q.id === queueId ? updatedQueue : q));
    setQueueItems(newQueues);

    if (shouldCreateIncome) {
      const transaction = {
        id: crypto.randomUUID(),
        type: 'income' as const,
        category: 'Service Payment',
        amount: queue.price,
        description: `${queue.queueNumber} - ${queue.customerName} - ${queue.serviceName}`,
        date: new Date(),
        // record precise ISO timestamp for DB compatibility
        transaction_at: new Date().toISOString(),
        createdAt: new Date(),
        queueId: queue.id,
      };
      setTransactions([...transactions, transaction]);
    }
  };

  const handleDelete = (id: string) => {
    setDeleteTarget({ type: 'item', value: id });
  };

  const handleDeleteWholeGroup = (phoneNumber: string) => {
    setDeleteTarget({ type: 'group', value: phoneNumber });
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;

    if (deleteTarget.type === 'item') {
      setQueueItems(queueItems.filter((q) => q.id !== deleteTarget.value));
    } else {
      setQueueItems(queueItems.filter((q) => q.phoneNumber !== deleteTarget.value));
    }

    setDeleteTarget(null);
  };

  // Stats
  const stats = {
    waiting: queueItems.filter((q) => q.status === 'waiting').length,
    inProgress: queueItems.filter((q) => q.status === 'in-progress').length,
    completed: queueItems.filter((q) => q.status === 'completed').length,
    today: queueItems.filter((q) => {
      const today = new Date().toISOString().split('T')[0];
      return q.createdAt.toISOString().split('T')[0] === today;
    }).length,
  };

  const isToday = (d: Date) => {
    const today = new Date();
    return d.toISOString().split('T')[0] === today.toISOString().split('T')[0];
  };

  const isThisWeek = (d: Date) => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);
    return d >= startOfWeek && d < endOfWeek;
  };

  const filteredQueues = queueItems.filter((q) => {
    if (filterStatus !== 'all' && q.status !== filterStatus) return false;
    if (filterDate === 'today' && !isToday(q.createdAt)) return false;
    if (filterDate === 'week' && !isThisWeek(q.createdAt)) return false;
    return true;
  });

  const sortedQueues = [...filteredQueues].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Group queues by customer (phone number as unique identifier)
  const groupedQueues = sortedQueues.reduce<Record<string, QueueGroup>>((acc, queue) => {
    const phoneKey = queue.phoneNumber;
    if (!acc[phoneKey]) {
      acc[phoneKey] = {
        customerName: queue.customerName,
        phoneNumber: queue.phoneNumber,
        vehicleType: queue.vehicleType,
        vehiclePlate: queue.vehiclePlate,
        services: [],
      };
    }
    acc[phoneKey].services.push(queue);
    return acc;
  }, {} as Record<string, any>);

  let groupedQueuesList = Object.values(groupedQueues);

  // Ensure services inside each group are sorted newest-first (by createdAt)
  groupedQueuesList.forEach((group) => {
    group.services.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  });

  // Sort groups by their newest service (so groups with latest activity appear first)
  groupedQueuesList.sort((a, b) => {
    const aTime = a.services && a.services[0] ? new Date(a.services[0].createdAt).getTime() : 0;
    const bTime = b.services && b.services[0] ? new Date(b.services[0].createdAt).getTime() : 0;
    return bTime - aTime;
  });

  const statusColors = {
    waiting: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    'in-progress': 'bg-blue-100 text-blue-800 border-blue-300',
    completed: 'bg-green-100 text-green-800 border-green-300',
    cancelled: 'bg-red-100 text-red-800 border-red-300',
  };

  const statusIcons = {
    waiting: <Clock className="w-4 h-4" />,
    'in-progress': <Play className="w-4 h-4" />,
    completed: <CheckCircle className="w-4 h-4" />,
    cancelled: <XCircle className="w-4 h-4" />,
  };

  // QUEUE LIST VIEW
  if (viewMode === 'list') {
    return (
      <div>
        <DeleteConfirmDialog
          open={deleteTarget !== null}
          title={deleteTarget?.type === 'group' ? 'Delete Whole Queue' : 'Delete Queue Item'}
          message={
            deleteTarget?.type === 'group'
              ? 'Are you sure you want to delete this entire customer queue and all their services? This action cannot be undone.'
              : 'Are you sure you want to delete this queue item? This action cannot be undone.'
          }
          confirmLabel={deleteTarget?.type === 'group' ? 'Delete Whole Queue' : 'Delete Item'}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmDelete}
        />
        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-6">
          <div className="bg-yellow-50 p-6 rounded-xl border-2 border-yellow-200">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold text-yellow-800">{stats.waiting}</p>
                <p className="text-sm text-yellow-600">Waiting</p>
              </div>
            </div>
          </div>
          <div className="bg-blue-50 p-6 rounded-xl border-2 border-blue-200">
            <div className="flex items-center gap-3">
              <Play className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-blue-800">{stats.inProgress}</p>
                <p className="text-sm text-blue-600">In Progress</p>
              </div>
            </div>
          </div>
          <div className="bg-green-50 p-6 rounded-xl border-2 border-green-200">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-green-800">{stats.completed}</p>
                <p className="text-sm text-green-600">Completed</p>
              </div>
            </div>
          </div>
          <div className="bg-[#FCDE04] p-6 rounded-xl border-2 border-[#e8cd04]">
            <div className="flex items-center gap-3">
              <Car className="w-8 h-8 text-[#1D1D1D]" />
              <div>
                <p className="text-2xl font-bold text-[#1D1D1D]">{stats.today}</p>
                <p className="text-sm text-[#1D1D1D]">Today's Queue</p>
              </div>
            </div>
          </div>
        </div>

        {/* Header with Big Add Button */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterStatus === 'all' ? 'bg-[#FCDE04] text-[#1D1D1D]' : 'bg-white text-gray-700 border border-[#D1D5DC]'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterStatus('waiting')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterStatus === 'waiting' ? 'bg-yellow-500 text-white' : 'bg-white text-gray-700 border border-[#D1D5DC]'
              }`}
            >
              Waiting
            </button>
            <button
              onClick={() => setFilterStatus('in-progress')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterStatus === 'in-progress' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 border border-[#D1D5DC]'
              }`}
            >
              In Progress
            </button>
            <button
              onClick={() => setFilterStatus('completed')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterStatus === 'completed' ? 'bg-green-500 text-white' : 'bg-white text-gray-700 border border-[#D1D5DC]'
              }`}
            >
              Completed
            </button>
            <div className="flex items-center gap-2 ml-2">
              <button
                onClick={() => setFilterDate('all')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterDate === 'all' ? 'bg-gray-100 text-gray-900' : 'bg-white text-gray-600 border border-[#D1D5DC]'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterDate('today')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterDate === 'today' ? 'bg-[#FCDE04] text-[#1D1D1D]' : 'bg-white text-gray-600 border border-[#D1D5DC]'
                }`}
              >
                Today
              </button>
              <button
                onClick={() => setFilterDate('week')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterDate === 'week' ? 'bg-[#FCDE04] text-[#1D1D1D]' : 'bg-white text-gray-600 border border-[#D1D5DC]'
                }`}
              >
                This week
              </button>
            </div>
          </div>
          <button
            onClick={() => setViewMode('create')}
            className="flex items-center gap-2 bg-[#FCDE04] text-[#1D1D1D] px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#e8cd04] transition-colors shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Plus className="w-6 h-6" />
            Add New Queue
          </button>
        </div>

        {/* Queue List - Grouped by Customer */}
        <div className="space-y-6">
          {groupedQueuesList.length === 0 ? (
            <div className="bg-white p-12 rounded-xl shadow-sm border border-[#D1D5DC] text-center">
              <p className="text-gray-500">No queue items found</p>
            </div>
          ) : (
            groupedQueuesList.map((group, groupIndex) => (
              <div key={`${group.phoneNumber}-${groupIndex}`} className="bg-white rounded-xl shadow-sm border border-[#D1D5DC] overflow-hidden hover:shadow-md transition-shadow">
                {/* Customer Header */}
                <div className="bg-gradient-to-r from-[#FCDE04] to-[#e8cd04] px-6 py-4 border-b border-[#D1D5DC]">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-[#1D1D1D]">{group.customerName}</h3>
                        {group.vehicleType === 'car' ? (
                          <Car className="w-5 h-5 text-[#1D1D1D]" />
                        ) : (
                          <Bike className="w-5 h-5 text-[#1D1D1D]" />
                        )}
                      </div>
                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-xs text-gray-700 font-semibold">Phone</p>
                          <p className="text-[#1D1D1D] font-semibold">{group.phoneNumber}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-700 font-semibold">Vehicle</p>
                          <p className="text-[#1D1D1D] font-semibold">{group.vehiclePlate}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-700 font-semibold">Services Count</p>
                          <p className="text-[#1D1D1D] font-semibold">{group.services.length}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Services Checklist */}
                <div className="p-6">
                  <div className="space-y-3">
                    {group.services.map((queue) => {
                      const allStatusesCompleted = group.services.every((q) => q.status === 'completed');
                      const allStatuses = group.services.map((q) => q.status);
                      const checkedCount = group.services.filter((q) => q.status === 'completed').length;
                      
                      return (
                        <div
                          key={queue.id}
                          className={`flex items-center justify-between p-4 border-2 rounded-lg transition-all ${
                            queue.status === 'completed'
                              ? 'bg-green-50 border-green-200'
                              : queue.status === 'in-progress'
                              ? 'bg-blue-50 border-blue-200'
                              : 'bg-gray-50 border-gray-200 hover:border-[#FCDE04]'
                          }`}
                        >
                          <div className="flex items-center gap-4 flex-1">
                            {/* Checkbox */}
                            <input
                              type="checkbox"
                              checked={queue.status === 'completed'}
                              onChange={() => {
                                if (queue.status === 'completed') {
                                  handleStatusChange(queue.id, 'waiting');
                                } else {
                                  handleStatusChange(queue.id, 'completed');
                                }
                              }}
                              className="w-5 h-5 text-[#FCDE04] rounded focus:ring-[#FCDE04] cursor-pointer"
                            />

                            {/* Service Info */}
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <p className={`font-semibold ${
                                  queue.status === 'completed'
                                    ? 'line-through text-gray-500'
                                    : 'text-[#1D1D1D]'
                                }`}>
                                  {queue.serviceName}
                                </p>
                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border ${statusColors[queue.status]}`}>
                                  {statusIcons[queue.status]}
                                  {queue.status.replace('-', ' ').toUpperCase()}
                                </span>
                              </div>
                              <p className="text-sm text-[#6797BF] font-bold">
                                Rp {queue.price.toLocaleString()}
                              </p>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-col gap-2 ml-4">
                            {queue.status === 'waiting' && (
                              <button
                                onClick={() => handleStatusChange(queue.id, 'in-progress')}
                                className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-xs font-medium whitespace-nowrap"
                              >
                                Start
                              </button>
                            )}
                            {queue.status === 'in-progress' && (
                              <button
                                onClick={() => handleStatusChange(queue.id, 'completed')}
                                className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-xs font-medium whitespace-nowrap"
                              >
                                Complete
                              </button>
                            )}
                            {queue.status !== 'completed' && queue.status !== 'cancelled' && (
                              <button
                                onClick={() => handleStatusChange(queue.id, 'cancelled')}
                                className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-xs font-medium whitespace-nowrap"
                              >
                                Cancel
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(queue.id)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete service"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Group Summary */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="grid md:grid-cols-4 gap-4 text-sm mb-4">
                      <div>
                        <p className="text-xs text-gray-600">Waiting</p>
                        <p className="font-bold text-yellow-600">
                          {group.services.filter((q) => q.status === 'waiting').length}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">In Progress</p>
                        <p className="font-bold text-blue-600">
                          {group.services.filter((q) => q.status === 'in-progress').length}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Completed</p>
                        <p className="font-bold text-green-600">
                          {group.services.filter((q) => q.status === 'completed').length}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Total Value</p>
                        <p className="font-bold text-[#6797BF]">
                          Rp {group.services.reduce((sum, q) => sum + q.price, 0).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    
                    {/* Delete Whole Group Button */}
                    <button
                      onClick={() => handleDeleteWholeGroup(group.phoneNumber)}
                      className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium text-sm flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Whole Queue
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  // CREATE ORDER VIEW (Split Screen)
  return (
    <div className="flex gap-6 -m-8 min-h-screen">
      {/* CENTER AREA - Main Input Flow */}
      <div className="flex-1 p-8 bg-gray-50">
        {/* Back Button */}
        <button
          onClick={() => setViewMode('list')}
          className="flex items-center gap-2 text-gray-600 hover:text-[#1D1D1D] mb-6 font-medium transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Queue List
        </button>

        {/* Header Toggle */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-sm border-2 border-gray-200 p-2 inline-flex">
            <button
              onClick={() => {
                setVehicleType('car');
                setSelectedSize('small');
                setSearchQuery('');
                setSelectedServices([]);
              }}
              className={`flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-lg transition-all ${
                vehicleType === 'car'
                  ? 'bg-[#FCDE04] text-[#1D1D1D] shadow-md'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Car className="w-6 h-6" />
              CAR SERVICE
            </button>
            <button
              onClick={() => {
                setVehicleType('motorcycle');
                setSelectedSize('motorcycleStandard');
                setSearchQuery('');
                setSelectedServices([]);
              }}
              className={`flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-lg transition-all ${
                vehicleType === 'motorcycle'
                  ? 'bg-[#FCDE04] text-[#1D1D1D] shadow-md'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Bike className="w-6 h-6" />
              MOTOR SERVICE
            </button>
          </div>
        </div>

        {/* Section A: Vehicle Identification */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-xl font-bold text-[#1D1D1D] mb-4">Vehicle Identification</h3>

          {/* Search Bar */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-[#1D1D1D] mb-2">
              Search Model
            </label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#FCDE04] focus:ring-4 focus:ring-[#FCDE04] focus:ring-opacity-20 text-lg"
                placeholder={vehicleType === 'car' ? 'e.g., Pajero, Jazz, Alphard...' : 'e.g., Beat, NMAX, Harley...'}
              />
            </div>
            {searchQuery && (
              <p className="text-sm text-gray-600 mt-2">
                Searching for: <span className="font-semibold text-[#6797BF]">{searchQuery}</span>
              </p>
            )}
          </div>

          {/* Size Category Selector */}
          <div>
            <label className="block text-sm font-semibold text-[#1D1D1D] mb-3">
              Size Category
            </label>
            <div className="space-y-3">
              {getSizeOptions().map((option) => (
                <label
                  key={option.value}
                  className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedSize === option.value
                      ? 'border-[#FCDE04] bg-[#FCDE04] bg-opacity-10'
                      : 'border-gray-300 hover:border-[#6797BF]'
                  }`}
                >
                  <input
                    type="radio"
                    name="vehicleSize"
                    value={option.value}
                    checked={selectedSize === option.value}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className="w-5 h-5 text-[#FCDE04] focus:ring-[#FCDE04]"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-[#1D1D1D]">{option.label}</p>
                    <p className="text-sm text-gray-500">{option.example}</p>
                  </div>
                  {selectedSize === option.value && (
                    <div className="w-8 h-8 bg-[#FCDE04] rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-[#1D1D1D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Section B: Service Selection */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-[#1D1D1D]">Select Services</h3>
            <p className="text-xs text-gray-500">
              Prices for <span className="font-semibold text-[#6797BF]">{getSizeOptions().find((opt) => opt.value === selectedSize)?.label}</span>
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {getAvailableServices().map((service) => {
              const price = getServicePrice(service);
              const isSelected = selectedServices.includes(service.id);

              return (
                <label
                  key={service.id}
                  className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    isSelected
                      ? 'border-[#FCDE04] bg-[#FCDE04] bg-opacity-5'
                      : 'border-gray-200 hover:border-[#6797BF]'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleService(service.id)}
                    className="absolute top-3 right-3 w-4 h-4 text-[#FCDE04] focus:ring-[#FCDE04] rounded"
                  />
                  <div className="pr-7">
                    <h4 className="font-semibold text-xs text-[#1D1D1D] mb-1 leading-tight">{service.title}</h4>
                    <p className="text-[10px] text-gray-500 mb-2">
                      {service.duration}
                    </p>
                    <p className="text-base font-bold text-[#6797BF]">
                      {price > 0 ? `Rp ${price.toLocaleString()}` : 'N/A'}
                    </p>
                  </div>
                </label>
              );
            })}
          </div>

          {getAvailableServices().length === 0 && (
            <div className="text-center py-8">
              <p className="text-sm text-gray-500">No services available for this vehicle type</p>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT PANEL - Order Summary */}
      <div className="w-96 bg-white p-6 shadow-xl border-l border-gray-200">
        <h3 className="text-2xl font-bold text-[#1D1D1D] mb-6">Order Summary</h3>

        <form onSubmit={handleProcessOrder} className="space-y-6">
          {/* Customer Info */}
          <div>
            <label className="block text-sm font-semibold text-[#1D1D1D] mb-2">
              Customer Name *
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#FCDE04]"
              placeholder="Enter name"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#1D1D1D] mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#FCDE04]"
              placeholder="+62 812-3456-7890"
            />
          </div>

          {/* Vehicle Info */}
          <div>
            <label className="block text-sm font-semibold text-[#1D1D1D] mb-2">
              Vehicle
            </label>
            <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="font-semibold text-[#1D1D1D]">{getVehicleDisplayName()}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#1D1D1D] mb-2">
              Plate No *
            </label>
            <input
              type="text"
              value={vehiclePlate}
              onChange={(e) => setVehiclePlate(e.target.value.toUpperCase())}
              required
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#FCDE04] font-bold text-center text-lg"
              placeholder="F 1234 ABC"
            />
          </div>

          {/* Selected Items */}
          <div>
            <label className="block text-sm font-semibold text-[#1D1D1D] mb-3">
              Selected Items
            </label>
            {selectedServices.length === 0 ? (
              <p className="text-sm text-gray-500 italic py-4">No services selected</p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {selectedServices.map((serviceId) => {
                  const service = services.find((s) => s.id === serviceId);
                  if (!service) return null;
                  const price = getServicePrice(service);

                  return (
                    <div key={serviceId} className="flex justify-between items-start py-2 border-b border-gray-100">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-[#1D1D1D]">
                          {service.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          ({getSizeOptions().find((opt) => opt.value === selectedSize)?.label})
                        </p>
                      </div>
                      <p className="text-sm font-bold text-[#6797BF] ml-2">
                        Rp {price.toLocaleString()}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Total */}
          <div className="pt-4 border-t-2 border-gray-300">
            <div className="flex justify-between items-center mb-6">
              <p className="text-lg font-semibold text-gray-700">Total Payment</p>
              <p className="text-3xl font-bold text-[#1D1D1D]">
                Rp {calculateTotal().toLocaleString()}
              </p>
            </div>

            <button
              type="submit"
              disabled={selectedServices.length === 0}
              className="w-full bg-[#FCDE04] text-[#1D1D1D] px-6 py-4 rounded-lg font-bold text-lg hover:bg-[#e8cd04] transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Process Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}