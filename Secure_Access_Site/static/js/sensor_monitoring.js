// Script pour la page de surveillance des capteurs
document.addEventListener('DOMContentLoaded', function() {
    // Charger les données actuelles des capteurs
    fetch('/api/latest_sensor_data')
        .then(response => response.json())
        .then(data => {
            const currentValuesContainer = document.getElementById('current-values');
            const sensorStatusContainer = document.getElementById('sensor-status');
            
            if (data && data.timestamp) {
                const date = new Date(data.timestamp);
                const formattedDate = date.toLocaleString('fr-FR');
                
                // Afficher les valeurs actuelles
                currentValuesContainer.innerHTML = `
                    <div class="row">
                        <div class="col-md-6">
                            <div class="text-center mb-3">
                                <h2 class="display-4">${data.temperature}°C</h2>
                                <p class="text-muted">Température</p>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="text-center mb-3">
                                <h2 class="display-4">${data.humidity}%</h2>
                                <p class="text-muted">Humidité</p>
                            </div>
                        </div>
                    </div>
                    <div class="text-muted text-center">
                        Dernière mise à jour: ${formattedDate}
                    </div>
                `;
                
                // Afficher le statut des capteurs
                sensorStatusContainer.innerHTML = `
                    <div class="row">
                        <div class="col-md-6">
                            <div class="sensor-status-card ${data.pir_status === 'Activé' ? 'sensor-status-active' : 'sensor-status-inactive'}">
                                <h5>Capteur PIR</h5>
                                <p class="h4">${data.pir_status}</p>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="sensor-status-card ${data.door_status === 'Fermée' ? 'sensor-status-active' : 'sensor-status-alert'}">
                                <h5>État Porte</h5>
                                <p class="h4">${data.door_status}</p>
                            </div>
                        </div>
                    </div>
                `;
            } else {
                currentValuesContainer.innerHTML = '<div class="alert alert-warning">Aucune donnée de capteur disponible</div>';
                sensorStatusContainer.innerHTML = '<div class="alert alert-warning">Aucune donnée de statut disponible</div>';
            }
        })
        .catch(error => {
            console.error('Erreur lors du chargement des données capteurs:', error);
            document.getElementById('current-values').innerHTML = 
                '<div class="alert alert-danger">Erreur lors du chargement des données capteurs</div>';
            document.getElementById('sensor-status').innerHTML = 
                '<div class="alert alert-danger">Erreur lors du chargement des données de statut</div>';
        });
    
    // Charger l'historique des données de température et d'humidité
    fetch('/api/sensor_data')
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                // Préparer les données pour le graphique
                const labels = data.map(item => {
                    const date = new Date(item.timestamp);
                    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
                });
                
                const temperatureData = data.map(item => item.temperature);
                const humidityData = data.map(item => item.humidity);
                
                // Créer le graphique
                const ctx = document.getElementById('tempHumidityChart').getContext('2d');
                new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: labels,
                        datasets: [
                            {
                                label: 'Température (°C)',
                                data: temperatureData,
                                borderColor: 'rgba(255, 99, 132, 1)',
                                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                                borderWidth: 2,
                                tension: 0.3,
                                yAxisID: 'y'
                            },
                            {
                                label: 'Humidité (%)',
                                data: humidityData,
                                borderColor: 'rgba(54, 162, 235, 1)',
                                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                                borderWidth: 2,
                                tension: 0.3,
                                yAxisID: 'y1'
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        interaction: {
                            mode: 'index',
                            intersect: false,
                        },
                        scales: {
                            y: {
                                type: 'linear',
                                display: true,
                                position: 'left',
                                title: {
                                    display: true,
                                    text: 'Température (°C)'
                                }
                            },
                            y1: {
                                type: 'linear',
                                display: true,
                                position: 'right',
                                title: {
                                    display: true,
                                    text: 'Humidité (%)'
                                },
                                grid: {
                                    drawOnChartArea: false,
                                }
                            }
                        }
                    }
                });
            } else {
                document.getElementById('tempHumidityChart').parentNode.innerHTML = 
                    '<div class="alert alert-warning">Aucune donnée historique disponible</div>';
            }
        })
        .catch(error => {
            console.error('Erreur lors du chargement des données historiques:', error);
            document.getElementById('tempHumidityChart').parentNode.innerHTML = 
                '<div class="alert alert-danger">Erreur lors du chargement des données historiques</div>';
        });
});
