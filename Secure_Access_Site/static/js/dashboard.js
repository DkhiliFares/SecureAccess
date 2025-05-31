// Script pour la page d'accueil (dashboard.js)
document.addEventListener('DOMContentLoaded', function() {
    // Charger les dernières tentatives d'authentification
    fetch('/api/auth_logs')
        .then(response => response.json())
        .then(data => {
            const recentLogs = data.slice(-3).reverse(); // Prendre les 3 derniers logs
            const tableBody = document.getElementById('recent-auth-logs');
            
            if (recentLogs.length > 0) {
                tableBody.innerHTML = '';
                recentLogs.forEach(log => {
                    const date = new Date(log.timestamp);
                    const formattedDate = date.toLocaleString('fr-FR');
                    
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${formattedDate}</td>
                        <td><span class="badge ${log.status === 'Autorisé' ? 'bg-success' : 'bg-danger'}">${log.status}</span></td>
                        <td>${log.rfid_id}</td>
                    `;
                    tableBody.appendChild(row);
                });
            } else {
                tableBody.innerHTML = '<tr><td colspan="3" class="text-center">Aucune donnée disponible</td></tr>';
            }
        })
        .catch(error => {
            console.error('Erreur lors du chargement des logs:', error);
            document.getElementById('recent-auth-logs').innerHTML = 
                '<tr><td colspan="3" class="text-center text-danger">Erreur lors du chargement des données</td></tr>';
        });
    
    // Charger l'état actuel des capteurs
    fetch('/api/latest_sensor_data')
        .then(response => response.json())
        .then(data => {
            const sensorContainer = document.getElementById('current-sensor-data');
            
            if (data && data.timestamp) {
                const date = new Date(data.timestamp);
                const formattedDate = date.toLocaleString('fr-FR');
                
                sensorContainer.innerHTML = `
                    <div class="row">
                        <div class="col-md-6">
                            <div class="card mb-2">
                                <div class="card-body text-center">
                                    <h5 class="card-title">Température</h5>
                                    <p class="display-4">${data.temperature}°C</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="card mb-2">
                                <div class="card-body text-center">
                                    <h5 class="card-title">Humidité</h5>
                                    <p class="display-4">${data.humidity}%</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6">
                            <div class="card mb-2">
                                <div class="card-body text-center">
                                    <h5 class="card-title">Capteur PIR</h5>
                                    <p class="h5">
                                        <span class="status-indicator ${data.pir_status === 'Activé' ? 'status-success' : 'status-danger'}"></span>
                                        ${data.pir_status}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="card mb-2">
                                <div class="card-body text-center">
                                    <h5 class="card-title">État Porte</h5>
                                    <p class="h5">
                                        <span class="status-indicator ${data.door_status === 'Fermée' ? 'status-success' : 'status-warning'}"></span>
                                        ${data.door_status}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="text-muted text-center mt-2">
                        Dernière mise à jour: ${formattedDate}
                    </div>
                `;
            } else {
                sensorContainer.innerHTML = '<div class="alert alert-warning">Aucune donnée de capteur disponible</div>';
            }
        })
        .catch(error => {
            console.error('Erreur lors du chargement des données capteurs:', error);
            document.getElementById('current-sensor-data').innerHTML = 
                '<div class="alert alert-danger">Erreur lors du chargement des données capteurs</div>';
        });
    
    // Charger l'historique récent de la porte
    fetch('/api/door_history')
        .then(response => response.json())
        .then(data => {
            const recentHistory = data.slice(-3).reverse(); // Prendre les 3 derniers événements
            const tableBody = document.getElementById('recent-door-history');
            
            if (recentHistory.length > 0) {
                tableBody.innerHTML = '';
                recentHistory.forEach(item => {
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
                tableBody.innerHTML = '<tr><td colspan="2" class="text-center">Aucune donnée disponible</td></tr>';
            }
        })
        .catch(error => {
            console.error('Erreur lors du chargement de l\'historique de la porte:', error);
            document.getElementById('recent-door-history').innerHTML = 
                '<tr><td colspan="2" class="text-center text-danger">Erreur lors du chargement des données</td></tr>';
        });
    
    // Charger les statistiques rapides
    Promise.all([
        fetch('/api/auth_logs').then(response => response.json()),
        fetch('/api/sensor_data').then(response => response.json())
    ])
    .then(([authLogs, sensorData]) => {
        const statsContainer = document.getElementById('stats-container');
        
        // Calculer les statistiques
        const totalAuth = authLogs.length;
        const successAuth = authLogs.filter(log => log.status === 'Autorisé').length;
        const failedAuth = totalAuth - successAuth;
        const successRate = totalAuth > 0 ? Math.round((successAuth / totalAuth) * 100) : 0;
        
        const doorOpenings = sensorData.filter(item => item.door_status === 'Ouverte').length;
        const avgTemp = sensorData.reduce((sum, item) => sum + item.temperature, 0) / sensorData.length;
        const avgHumidity = sensorData.reduce((sum, item) => sum + item.humidity, 0) / sensorData.length;
        
        statsContainer.innerHTML = `
            <div class="row">
                <div class="col-md-6">
                    <div class="card mb-2">
                        <div class="card-body">
                            <h6 class="card-title">Authentifications</h6>
                            <div class="d-flex justify-content-between">
                                <div>
                                    <span class="text-success">${successAuth} réussies</span><br>
                                    <span class="text-danger">${failedAuth} échouées</span>
                                </div>
                                <div class="text-center">
                                    <div class="h3">${successRate}%</div>
                                    <small class="text-muted">Taux de succès</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card mb-2">
                        <div class="card-body">
                            <h6 class="card-title">Activité Porte</h6>
                            <div class="d-flex justify-content-between">
                                <div>
                                    <span>${doorOpenings} ouvertures</span><br>
                                    <span class="text-muted">dernières 24h</span>
                                </div>
                                <div class="text-center">
                                    <div class="h3">${avgTemp.toFixed(1)}°C</div>
                                    <small class="text-muted">Temp. moyenne</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    })
    .catch(error => {
        console.error('Erreur lors du chargement des statistiques:', error);
        document.getElementById('stats-container').innerHTML = 
            '<div class="alert alert-danger">Erreur lors du chargement des statistiques</div>';
    });
});
