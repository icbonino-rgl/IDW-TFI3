const formularioMascota = document.getElementById('formularioMascota');
const tablaMascotas = document.getElementById('tablaMascotas');
const totalMascotas = document.getElementById('totalMascotas');
const botonCancelar = document.getElementById('botonCancelar');

// Leer datos de LocalStorage
function obtenerMascotas() {
    return JSON.parse(localStorage.getItem('mascotas')) || [];
}

// Guardar datos en LocalStorage
function guardarMascotas(mascotas) {
    localStorage.setItem('mascotas', JSON.stringify(mascotas));
}

// Generar ID único automáticamente
function generarId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

// Renderizar la tabla
function actualizarTabla() {
    const mascotas = obtenerMascotas();
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
formularioMascota.addEventListener('submit', function(e) {
    e.preventDefault();
    const mascotas = obtenerMascotas();
    
    // Capturar datos y transformarlos en objeto
    const datosMascota = {
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
        const indice = mascotas.findIndex(m => m.idMascota === idActual);
        mascotas[indice] = datosMascota;
    } else {
        // Alta
        mascotas.push(datosMascota);
    }

    guardarMascotas(mascotas);
    formularioMascota.reset();
    document.getElementById('idMascota').value = '';
    botonCancelar.classList.add('d-none');
    actualizarTabla();
});

// Eliminar Mascota
function eliminarMascota(id) {
    if(confirm("¿Está seguro que desea eliminar esta mascota?")) { // Previa confirmación
        let mascotas = obtenerMascotas();
        mascotas = mascotas.filter(m => m.idMascota !== id);
        guardarMascotas(mascotas);
        actualizarTabla();
    }
}

// Cargar datos al formulario para editar
function editarMascota(id) {
    const mascotas = obtenerMascotas();
    const mascota = mascotas.find(m => m.idMascota === id);
    
    document.getElementById('idMascota').value = mascota.idMascota;
    document.getElementById('nombreMascota').value = mascota.nombreMascota;
    document.getElementById('nombreDuenio').value = mascota.nombreDuenio;
    document.getElementById('color').value = mascota.color;
    document.getElementById('edad').value = mascota.edad;
    document.getElementById('peso').value = mascota.peso;

    botonCancelar.classList.remove('d-none');
}

// Cancelar edición
botonCancelar.addEventListener('click', () => {
    formularioMascota.reset();
    document.getElementById('idMascota').value = '';
    botonCancelar.classList.add('d-none');
});

// Cargar tabla al iniciar
document.addEventListener('DOMContentLoaded', actualizarTabla);