document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("searchInput");
    const resultsDiv = document.getElementById("results");

    let timeoutId;

    // Fonction pour effectuer la recherche de séries en utilisant l'API TVmaze
    const searchShows = async (query) => {
        if (!query) {
            resultsDiv.innerHTML = ""; // Efface les résultats s'il n'y a pas de requête
            return;
        }

        try {
            // Appel à l'API TVmaze pour chercher des séries par nom
            const response = await fetch(`https://api.tvmaze.com/search/shows?q=${query}`);
            const data = await response.json();
            displayResults(data);
        } catch (error) {
            console.error("Erreur lors de la recherche des séries :", error);
            resultsDiv.innerHTML = `<p>Une erreur est survenue. Veuillez réessayer.</p>`;
        }
    };

    // Fonction pour afficher les résultats
    const displayResults = (shows) => {
        resultsDiv.innerHTML = ""; // Efface les résultats précédents

        if (shows.length === 0) {
            resultsDiv.innerHTML = `<p>Aucune série trouvée.</p>`;
            return;
        }

        // Crée un élément pour chaque série et l'ajoute au DOM
        shows.forEach((showItem) => {
            const show = showItem.show;
            const showDiv = document.createElement("div");
            showDiv.classList.add("show");

            // Remplissage du div pour chaque série
            showDiv.innerHTML = `
                <div style="display: flex; align-items: center; gap: 15px;">
                    ${show.image ? `<img src="${show.image.medium}" alt="${show.name}">` : ""}
                    <div>
                        <h3><a href="${show.url}" target="_blank">${show.name}</a></h3>
                        <p><strong>Genres :</strong> ${show.genres.join(", ")}</p>
                        <p><strong>Statut :</strong> ${show.status}</p>
                        <p><strong>Note :</strong> ${show.rating.average ? `${show.rating.average}/10` : "N/A"}</p>
                        <div class="summary">${show.summary ? show.summary : "Pas de description disponible."}</div>
                    </div>
                </div>
            `;

            resultsDiv.appendChild(showDiv);
        });
    };

    // Event listener pour l'entrée de texte dans le champ de recherche
    searchInput.addEventListener("input", () => {
        clearTimeout(timeoutId); // Efface le précédent timeout pour éviter de faire trop de requêtes
        const query = searchInput.value.trim();

        // Délai avant de lancer la recherche (300 ms après avoir arrêté de taper)
        timeoutId = setTimeout(() => {
            searchShows(query);
        }, 300);
    });
});
