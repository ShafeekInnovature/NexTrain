document.addEventListener('DOMContentLoaded', () => {
    // Set today's date as default
    const dateInput = document.getElementById('tripDate');
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
    dateInput.min = today;

    const searchForm = document.getElementById('searchForm');
    const resultsSection = document.getElementById('resultsSection');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const trainResults = document.getElementById('trainResults');
    const resultCounts = document.getElementById('resultCounts');

    // Mock Database
    const mockTrains = [
        { id: 'TR-1045', name: 'Express Commuter', departure: '08:30', arrival: '10:45', duration: '2h 15m', status: 'On Time', price: '$45' },
        { id: 'TR-2991', name: 'Intercity Fast', departure: '09:15', arrival: '11:10', duration: '1h 55m', status: 'On Time', price: '$55' },
        { id: 'TR-0882', name: 'Regional Standard', departure: '10:00', arrival: '12:45', duration: '2h 45m', status: 'Delayed', delayTime: '15m', price: '$35' },
        { id: 'TR-3411', name: 'Bullet Premium', departure: '11:30', arrival: '12:50', duration: '1h 20m', status: 'On Time', price: '$85' },
        { id: 'TR-5002', name: 'Scenic Route', departure: '13:00', arrival: '16:30', duration: '3h 30m', status: 'On Time', price: '$40' }
    ];

    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const origin = document.getElementById('origin').value;
        const destination = document.getElementById('destination').value;
        
        // Show loading state
        resultsSection.classList.remove('d-none');
        trainResults.innerHTML = '';
        loadingIndicator.classList.remove('d-none');
        resultCounts.textContent = 'Searching...';

        // Scroll to results
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Simulate network request
        setTimeout(() => {
            loadingIndicator.classList.add('d-none');
            renderResults(origin, destination);
        }, 1500);
    });

    function renderResults(origin, destination) {
        // Randomize mock data slightly based on search count just for demo purposes
        const numResults = Math.floor(Math.random() * 3) + 3; // 3 to 5 results
        const shuffled = [...mockTrains].sort(() => 0.5 - Math.random());
        const selectedTrains = shuffled.slice(0, numResults);
        
        // Sort by departure time
        selectedTrains.sort((a, b) => a.departure.localeCompare(b.departure));

        resultCounts.textContent = `Showing ${selectedTrains.length} results for ${origin} to ${destination}`;

        if (selectedTrains.length === 0) {
            trainResults.innerHTML = `
                <div class="col-12 text-center py-5">
                    <i class="fa-solid fa-train-track fs-1 text-muted mb-3"></i>
                    <h5 class="text-white">No trains found</h5>
                    <p class="text-muted">Try adjusting your search criteria or date.</p>
                </div>
            `;
            return;
        }

        selectedTrains.forEach((train, index) => {
            // Stagger animation delay
            const delay = index * 0.1;
            
            const isDelayed = train.status === 'Delayed';
            const statusClass = isDelayed ? 'status-delayed' : 'status-on-time';
            const statusIcon = isDelayed ? 'fa-triangle-exclamation' : 'fa-circle-check';
            const statusText = isDelayed ? `Delayed (+${train.delayTime})` : 'On Time';

            const cardHTML = `
                <div class="col-12" style="animation: fadeInUp 0.5s ease ${delay}s both;">
                    <div class="train-card d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-4">
                        
                        <!-- Train Info -->
                        <div class="d-flex flex-column" style="min-width: 200px;">
                            <span class="train-name fs-5">${train.name}</span>
                            <div class="d-flex align-items-center gap-2 mt-1">
                                <span class="train-number">${train.id}</span>
                                <span class="status-badge ${statusClass}">
                                    <i class="fa-solid ${statusIcon}"></i> ${statusText}
                                </span>
                            </div>
                        </div>

                        <!-- Journey Timeline -->
                        <div class="d-flex align-items-center flex-grow-1 px-md-4 py-3 py-md-0">
                            <div class="time-box">
                                <div class="time-val">${train.departure}</div>
                                <div class="time-label text-truncate" style="max-width: 100px;">${origin}</div>
                            </div>
                            
                            <div class="journey-line d-flex align-items-center">
                                <div class="journey-dot start"></div>
                                <span class="duration-badge">${train.duration}</span>
                                <i class="fa-solid fa-train journey-icon"></i>
                                <div class="journey-dot end"></div>
                            </div>

                            <div class="time-box">
                                <div class="time-val">${train.arrival}</div>
                                <div class="time-label text-truncate" style="max-width: 100px;">${destination}</div>
                            </div>
                        </div>

                        <!-- Price & Action -->
                        <div class="d-flex flex-md-column align-items-center align-items-md-end justify-content-between gap-2" style="min-width: 120px;">
                            <div class="fs-4 fw-bold text-white">${train.price}</div>
                            <button class="book-btn">Select</button>
                        </div>
                        
                    </div>
                </div>
            `;
            trainResults.insertAdjacentHTML('beforeend', cardHTML);
        });
    }
});
