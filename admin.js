let vehicleFleet = [];

const container = document.getElementById('fleetCardsContainer');
const form = document.getElementById('fleetForm');

function createVehicleCard(vehicle) {
    const card = document.createElement('div');
    card.className = 'vehicle-card';
    card.dataset.regNo = vehicle.regNo;

    const availabilityClass = vehicle.isAvailable === 'Available' ? 'Available' : 'Unavailable';
    const statusText = vehicle.isAvailable;

    card.innerHTML = `
        <img src="https://example.com/sample_vehicle.jpg" alt="${vehicle.regNo}" 
            onerror="this.onerror=null;this.src='https://via.placeholder.com/300x150?text=Vehicle'">
        <div class="card-details">
            <p><strong>Reg No:</strong> ${vehicle.regNo}</p>
            <p><strong>Category:</strong> ${vehicle.category}</p>
            <p><strong>Driver:</strong> <span id="driverName_${vehicle.regNo}">${vehicle.driverName}</span></p>
            <p><strong>Status:</strong> 
                <span class="status ${availabilityClass}" id="status_${vehicle.regNo}">
                    ${statusText}
                </span>
            </p>
        </div>
        <div class="card-actions">
            <button class="update-btn" data-reg-no="${vehicle.regNo}">Update Driver</button>
            <button class="availability-btn" data-reg-no="${vehicle.regNo}">Change Availability</button>
            <button class="delete-btn" data-reg-no="${vehicle.regNo}">Delete Vehicle</button>
        </div>
    `;

    card.querySelector('.update-btn').addEventListener('click', handleUpdateDriver);
    card.querySelector('.availability-btn').addEventListener('click', handleChangeAvailability);
    card.querySelector('.delete-btn').addEventListener('click', handleDeleteVehicle);

    return card;
}

function renderCards(fleetToRender = vehicleFleet) {
    container.innerHTML = '';
    fleetToRender.forEach(vehicle => {
        container.appendChild(createVehicleCard(vehicle));
    });
}

form.addEventListener('submit', function(e) {
    e.preventDefault();

    const newVehicle = {
        regNo: document.getElementById('regNo').value.trim(),
        category: document.getElementById('category').value,
        driverName: document.getElementById('driverName').value.trim(),
        isAvailable: document.getElementById('isAvailable').value 
    };

    if (!newVehicle.regNo || !newVehicle.category || !newVehicle.driverName) {
        alert("All fields are required. Please fill them out.");
        return;
    }

    vehicleFleet.push(newVehicle);
    renderCards();
    form.reset();
});

function findAndUpdateVehicle(regNo, property, value) {
    const vehicle = vehicleFleet.find(v => v.regNo === regNo);
    if (vehicle) {
        vehicle[property] = value;
    }
}

function handleUpdateDriver(event) {
    const regNo = event.target.dataset.regNo;
    const newDriverName = prompt("Enter new driver name:");

    if (newDriverName === null) return;

    const trimmedName = newDriverName.trim();

    if (trimmedName === "") {
        alert("Driver name cannot be empty.");
        return;
    }

    findAndUpdateVehicle(regNo, 'driverName', trimmedName);

    const driverNameSpan = document.getElementById(`driverName_${regNo}`);
    if (driverNameSpan) {
        driverNameSpan.textContent = trimmedName;
    }
}

function handleChangeAvailability(event) {
    const regNo = event.target.dataset.regNo;
    const vehicle = vehicleFleet.find(v => v.regNo === regNo);

    if (vehicle) {
        const newStatus = vehicle.isAvailable === 'Available' ? 'Unavailable' : 'Available';
        findAndUpdateVehicle(regNo, 'isAvailable', newStatus);

        const statusSpan = document.getElementById(`status_${regNo}`);
        if (statusSpan) {
            statusSpan.textContent = newStatus;
            statusSpan.className = `status ${newStatus}`;
        }
    }
}

function handleDeleteVehicle(event) {
    const regNo = event.target.dataset.regNo;
    const isConfirmed = confirm(`Are you sure you want to delete vehicle ${regNo}?`);

    if (isConfirmed) {
        vehicleFleet = vehicleFleet.filter(v => v.regNo !== regNo);
        renderCards();
    }
}

const categoryFilter = document.getElementById('categoryFilter');
const availabilityFilter = document.getElementById('availabilityFilter');
const clearFilterBtn = document.getElementById('clearFilterBtn');

function applyFilters() {
    const selectedCategory = categoryFilter.value;
    const selectedAvailability = availabilityFilter.value;

    const filteredFleet = vehicleFleet.filter(vehicle => {
        const categoryMatch = selectedCategory === 'All' || vehicle.category === selectedCategory;
        const availabilityMatch = selectedAvailability === 'All' || vehicle.isAvailable === selectedAvailability;
        return categoryMatch && availabilityMatch;
    });

    renderCards(filteredFleet);
}

categoryFilter.addEventListener('change', applyFilters);
availabilityFilter.addEventListener('change', applyFilters);

clearFilterBtn.addEventListener('click', function() {
    categoryFilter.value = 'All';
    availabilityFilter.value = 'All';
    renderCards();
});

vehicleFleet.push({ regNo: 'MH01AB1234', category: 'Car', driverName: 'Ramesh', isAvailable: 'Available' });
vehicleFleet.push({ regNo: 'DL99XZ0001', category: 'Truck', driverName: 'Suresh', isAvailable: 'Unavailable' });
vehicleFleet.push({ regNo: 'KA05BA9876', category: 'Bus', driverName: 'Deepa', isAvailable: 'Available' });
renderCards();


