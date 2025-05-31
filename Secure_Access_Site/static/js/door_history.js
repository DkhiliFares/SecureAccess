// Script pour la page d'historique de la porte
document.addEventListener('DOMContentLoaded', function() {
    // Charger l'historique de la porte
    loadDoorHistory();
    
    // Ajouter les écouteurs d'événements pour les filtres
    document.getElementById('date-filter').addEventListener('change', loadDoorHistory);
    document.getElementById('status-filter').addEventListener('change', loadDoorHistory);
    document.getElementById('refresh-btn').addEventListener('click', loadDoorHistory);
    
    // Fonction pour charger l'historique avec filtres
    function loadDoorHistory() {
        fetch('/api/door_history')
            .then(response => response.json())
            .then(data => {
                // Appliquer les filtres
                const dateFilter = document.getElementById('date-filter').value;
                const statusFilter = document.getElementById('status-filter').value;
                
                let filteredData = data;
                
                // Filtre par date
                if (dateFilter) {
                    const filterDate = new Date(dateFilter).toISOString().split('T')[0];
                    filteredData = filteredData.filter(item => {
                        const itemDate = new Date(item.timestamp).toISOString().split('T')[0];
                        return itemDate === filterDate;
                    });
                }
                
                // Filtre par statut
                if (statusFilter) {
                    filteredData = filteredData.filter(item => item.door_status === statusFilter);
                }
                
                // Afficher les résultats
                displayDoorHistory(filteredData);
                
                // Mettre à jour le graphique
                updateDoorStatsChart(data);
            })
            .catch(error => {
                console.error('Erreur lors du chargement de l\'historique de la porte:', error);
                document.getElementById('door-history-table').innerHTML = 
                    '<tr><td colspan="2" class="text-center text-danger">Erreur lors du chargement des données</td></tr>';
            });
    }
    
    // Fonction pour afficher l'historique dans le tableau
    function displayDoorHistory(history) {
        const tableBody = document.getElementById('door-history-table');
        
        if (history.length > 0) {
            tableBody.innerHTML = '';
            history.forEach(item => {
                const date = new Date(item.timestamp);
                const formattedDate = date.toLocaleString('fr-FR');
                
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${formattedDate}</td>
                    <td><span class="badge ${item.door_status === 'Fermée' ? 'bg-success' : 'bg-warning text-dark'}">${item.door_status}</span></td>
                `;
                tableBody.appendChild(row);
            });
        } else {
            tableBody.innerHTML = '<tr><td colspan="2" class="text-center">Aucune donnée correspondant aux critères</td></tr>';
        }
    }
    
    // Fonction pour mettre à jour le graphique des statistiques
    function updateDoorStatsChart(data) {
        // Calculer les statistiques par heure
        const hourlyStats = {};
        
        data.forEach(item => {
            const date = new Date(item.timestamp);
            const hour = date.getHours();
            const hourKey = `${hour}h`;
            
            if (!hourlyStats[hourKey]) {
                hourlyStats[hourKey] = { open: 0, closed: 0 };
            }
            
            if (item.door_status === 'Ouverte') {
                hourlyStats[hourKey].open += 1;
            } else {
                hourlyStats[hourKey].closed += 1;
            }
        });
        
        // Préparer les données pour le graphique
        const labels = Object.keys(hourlyStats).sort((a, b) => {
            return parseInt(a) - parseInt(b);
        });
        
        const openData = labels.map(hour => hourlyStats[hour].open);
        const closedData = labels.map(hour => hourlyStats[hour].closed);
        
        // Créer le graphique
        const ctx = document.getElementById('doorStatsChart').getContext('2d');
        
        // Détruire le graphique existant s'il y en a un
        if (window.doorChart) {
            window.doorChart.destroy();
        }
        
        window.doorChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Ouvertures',
                        data: openData,
                        backgroundColor: 'rgba(255, 193, 7, 0.5)',
                        borderColor: 'rgba(255, 193, 7, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Fermetures',
                        data: closedData,
                        backgroundColor: 'rgba(40, 167, 69, 0.5)',
                        borderColor: 'rgba(40, 167, 69, 1)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Heure'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Nombre d\'événements'
                        },
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
    }
});
