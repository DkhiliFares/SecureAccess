// Script pour la page des logs d'authentification
document.addEventListener('DOMContentLoaded', function () {
    // Charger les logs d'authentification
    loadAuthLogs();

    // Ajouter les écouteurs d'événements pour les filtres
    document.getElementById('date-filter').addEventListener('change', loadAuthLogs);
    document.getElementById('status-filter').addEventListener('change', loadAuthLogs);
    document.getElementById('rfid-filter').addEventListener('input', loadAuthLogs);

    // Fonction pour charger les logs avec filtres
    function loadAuthLogs() {
        fetch('/api/auth_logs')
            .then(response => response.json())
            .then(data => {
                // Appliquer les filtres
                const dateFilter = document.getElementById('date-filter').value;
                const statusFilter = document.getElementById('status-filter').value;
                const rfidFilter = document.getElementById('rfid-filter').value.trim().toUpperCase();

                let filteredData = data;

                // Filtre par date
                if (dateFilter) {
                    const filterDate = new Date(dateFilter).toISOString().split('T')[0];
                    filteredData = filteredData.filter(log => {
                        const logDate = new Date(log.timestamp).toISOString().split('T')[0];
                        return logDate === filterDate;
                    });
                }

                // Filtre par statut
                if (statusFilter) {
                    filteredData = filteredData.filter(log => log.status === statusFilter);
                }

                // Filtre par RFID
                if (rfidFilter) {
                    filteredData = filteredData.filter(log => log.rfid_id.includes(rfidFilter));
                }

                // Afficher les résultats
                displayAuthLogs(filteredData);
            })
            .catch(error => {
                console.error('Erreur lors du chargement des logs:', error);
                document.getElementById('auth-logs-table').innerHTML =
                    '<tr><td colspan="6" class="text-center text-danger">Erreur lors du chargement des données</td></tr>';
            });
    }

    // Fonction pour afficher les logs dans le tableau
    function displayAuthLogs(logs) {
        const tableBody = document.getElementById('auth-logs-table');

        if (logs.length > 0) {
            tableBody.innerHTML = '';
            logs.forEach(log => {
                const date = new Date(log.timestamp);
                const formattedDate = date.toLocaleString('fr-FR');

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${formattedDate}</td>
                    <td><span class="badge ${log.status === 'Autorisé' ? 'bg-success' : 'bg-danger'}">${log.status}</span></td>
                    <td>${log.rfid_id}</td>
                    <td>${log.user_name}</td>
                    <td>${log.reason || '-'}</td>
                    <td>${log.image_path ?
                        `<button class="btn btn-sm btn-outline-primary" onclick="showImage('${log.image_path}')">
                            <i class="bi bi-image"></i> Voir
                        </button>` :
                        '-'}
                    </td>
                `;
                tableBody.appendChild(row);
            });
        } else {
            tableBody.innerHTML = '<tr><td colspan="6" class="text-center">Aucune donnée correspondant aux critères</td></tr>';
        }
    }
});

// Fonction pour afficher l'image dans le modal
function showImage(imagePath) {
    const keyInput = document.getElementById('decryption-key');
    const key = keyInput.value.trim();

    if (!key) {
        alert("Veuillez entrer la clé de déchiffrement pour voir cette image.");
        keyInput.focus();
        return;
    }

    const modalImage = document.getElementById('modalImage');

    // Extract filename from path (e.g., /static/img/file.bin -> file.bin)
    const filename = imagePath.split('/').pop();

    // Construct API URL
    const imageUrl = `/api/view_image/${filename}?key=${encodeURIComponent(key)}`;

    // Set up error handling
    modalImage.onerror = function () {
        alert("Impossible de déchiffrer l'image. Vous avez probablement saisi une mauvaise clé.");
        this.src = ""; // Clear the broken image
        // Reset error handler to avoid loops
        this.onerror = null;
    };

    modalImage.src = imageUrl;

    const imageModal = new bootstrap.Modal(document.getElementById('imageModal'));
    imageModal.show();
}
