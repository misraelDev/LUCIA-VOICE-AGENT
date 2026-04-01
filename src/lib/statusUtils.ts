export const getStatusText = (status: string) => {
  switch (status.toUpperCase()) {
    case 'PENDING':
      return 'Pendiente'
    case 'IN_PROGRESS':
      return 'En Progreso'
    case 'COMPLETED':
      return 'Completada'
    case 'REJECTED':
      return 'Rechazada'
    default:
      return status
  }
}

export const getStatusColor = (status: string) => {
  switch (status.toUpperCase()) {
    case 'PENDING':
      return 'bg-yellow-500 text-white border border-yellow-600'
    case 'IN_PROGRESS':
      return 'bg-blue-500 text-white border border-blue-600'
    case 'COMPLETED':
      return 'bg-green-500 text-white border border-green-600'
    case 'REJECTED':
      return 'bg-red-500 text-white border border-red-600'
    default:
      return 'bg-gray-500 text-white border border-gray-600'
  }
}
