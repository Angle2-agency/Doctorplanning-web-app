export const determineStatusText = function(status) {
  switch (status) {
    case 'pending':
      return 'Bilan biologique'
    case 'approved':
      return 'Bilan biologique'
    case 'confirmed':
      return 'Confirmé'
    case 'critical':
      return 'Critique'
    case 'waiting':
      return 'En attente'
    case 'pipeline':
      return 'Pipeline'
    default:
      console.log('No status')
  }
}
