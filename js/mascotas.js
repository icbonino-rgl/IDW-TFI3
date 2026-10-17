const formMascota = document.getElementById('formMascota');
const tablaMascotas = document.getElementById('tablaMascotas');
const totalMascotas = document.getElementById('totalMascotas');
const btnCancelar = document.getElementById('btnCancelar');

// Leer datos de LocalStorage
function getMascotas() {
    return JSON.parse(localStorage.getItem('mascotas')) || [];
}

// Guardar datos en LocalStorage
function saveMascotas(mascotas) {
    localStorage.setItem('mascotas', JSON.stringify(mascotas));
}

// Generar ID único automáticamente
function generarId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

// Renderizar la tabla
function renderizarTabla() {
    const mascotas = getMascotas();
    tablaMascotas.innerHTML = '';
    totalMascotas.textContent = mascotas.length;

    mascotas.forEach(mascota => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${mascota.nombreMascota}</td>
            <td>${mascota.nombreDuenio}</td>
            <td>${mascota.color}</td>
            <td>${mascota.edad}</td>
            <td>${mascota.peso} kg</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editarMascota('${mascota.idMascota}')">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="eliminarMascota('${mascota.idMascota}')">Eliminar</button>
            </td>
        `;
        tablaMascotas.appendChild(tr);
    });
}

// Procesar Formulario (Alta y Modificación)
formMascota.addEventListener('submit', function(e) {
    e.preventDefault();
    const mascotas = getMascotas();
    
    // Capturar datos y transformarlos en objeto
    const mascotaData = {
        idMascota: document.getElementById('idMascota').value || generarId(),
        nombreMascota: document.getElementById('nombreMascota').value,
        nombreDuenio: document.getElementById('nombreDuenio').value,
        color: document.getElementById('color').value,
        edad: parseInt(document.getElementById('edad').value),
        peso: parseFloat(document.getElementById('peso').value)
    };

    const idActual = document.getElementById('idMascota').value;

    if (idActual) {
        // Modificación
        const index = mascotas.findIndex(m => m.idMascota === idActual);
        mascotas[index] = mascotaData;
    } else {
        // Alta
        mascotas.push(mascotaData);
    }

    saveMascotas(mascotas);
    formMascota.reset();
    document.getElementById('idMascota').value = '';
    btnCancelar.classList.add('d-none');
    renderizarTabla();
});

// Eliminar Mascota
function eliminarMascota(id) {
    if(confirm("¿Está seguro que desea eliminar esta mascota?")) { // Previa confirmación
        let mascotas = getMascotas();
        mascotas = mascotas.filter(m => m.idMascota !== id);
        saveMascotas(mascotas);
        renderizarTabla();
    }
}

// Cargar datos al formulario para editar
function editarMascota(id) {
    const mascotas = getMascotas();
    const mascota = mascotas.find(m => m.idMascota === id);
    
    document.getElementById('idMascota').value = mascota.idMascota;
    document.getElementById('nombreMascota').value = mascota.nombreMascota;
    document.getElementById('nombreDuenio').value = mascota.nombreDuenio;
    document.getElementById('color').value = mascota.color;
    document.getElementById('edad').value = mascota.edad;
    document.getElementById('peso').value = mascota.peso;

    btnCancelar.classList.remove('d-none');
}

// Cancelar edición
btnCancelar.addEventListener('click', () => {
    formMascota.reset();
    document.getElementById('idMascota').value = '';
    btnCancelar.classList.add('d-none');
});

// Cargar tabla al iniciar
document.addEventListener('DOMContentLoaded', renderizarTabla);