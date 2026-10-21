const formularioVeterinario = document.getElementById('formularioVeterinario');
const tablaVeterinarios = document.getElementById('tablaVeterinarios');
const botonCancelarVeterinario = document.getElementById('botonCancelarVeterinario');

// Leer datos de LocalStorage
function obtenerVeterinarios() {
    return JSON.parse(localStorage.getItem('veterinarios')) || [];
}

// Guardar datos en LocalStorage
function guardarVeterinarios(veterinarios) {
    localStorage.setItem('veterinarios', JSON.stringify(veterinarios));
}

// Generar ID único automáticamente
function generarId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

// Formatear a moneda ARS
const formateadorMoneda = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS'
});

// Renderizar la tabla
function actualizarTablaVeterinarios() {
    const veterinarios = obtenerVeterinarios();
    tablaVeterinarios.innerHTML = '';

    veterinarios.forEach(vet => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${vet.matricula}</td>
            <td>${vet.nombre}</td>
            <td>${vet.especializacion}</td>
            <td>${formateadorMoneda.format(vet.valorConsulta)}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editarVeterinario('${vet.idVeterinario}')">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="eliminarVeterinario('${vet.idVeterinario}')">Eliminar</button>
            </td>
        `;
        tablaVeterinarios.appendChild(tr);
    });
}

// Procesar Formulario (Alta y Modificación)
formularioVeterinario.addEventListener('submit', function(e) {
    e.preventDefault();
    const veterinarios = obtenerVeterinarios();
    
    // Capturar datos y transformarlos en objeto
    const datosVeterinario = {
        idVeterinario: document.getElementById('idVeterinario').value || generarId(),
        matricula: parseInt(document.getElementById('matricula').value),
        nombre: document.getElementById('nombre').value,
        especializacion: document.getElementById('especializacion').value,
        valorConsulta: parseFloat(document.getElementById('valorConsulta').value)
    };

    const idActual = document.getElementById('idVeterinario').value;

    if (idActual) {
        // Modificación
        const indice = veterinarios.findIndex(v => v.idVeterinario === idActual);
        veterinarios[indice] = datosVeterinario;
    } else {
        // Alta
        veterinarios.push(datosVeterinario);
    }

    guardarVeterinarios(veterinarios);
    formularioVeterinario.reset();
    document.getElementById('idVeterinario').value = '';
    botonCancelarVeterinario.classList.add('d-none');
    actualizarTablaVeterinarios();
});

// Eliminar Veterinario
function eliminarVeterinario(id) {
    if(confirm("¿Está seguro que desea eliminar este veterinario?")) { // Previa confirmación
        let veterinarios = obtenerVeterinarios();
        veterinarios = veterinarios.filter(v => v.idVeterinario !== id);
        guardarVeterinarios(veterinarios);
        actualizarTablaVeterinarios();
    }
}

// Cargar datos al formulario para editar
function editarVeterinario(id) {
    const veterinarios = obtenerVeterinarios();
    const vet = veterinarios.find(v => v.idVeterinario === id);
    
    document.getElementById('idVeterinario').value = vet.idVeterinario;
    document.getElementById('matricula').value = vet.matricula;
    document.getElementById('nombre').value = vet.nombre;
    document.getElementById('especializacion').value = vet.especializacion;
    document.getElementById('valorConsulta').value = vet.valorConsulta;

    botonCancelarVeterinario.classList.remove('d-none');
}

// Cancelar edición
botonCancelarVeterinario.addEventListener('click', () => {
    formularioVeterinario.reset();
    document.getElementById('idVeterinario').value = '';
    botonCancelarVeterinario.classList.add('d-none');
});

// Cargar tabla al iniciar
document.addEventListener('DOMContentLoaded', actualizarTablaVeterinarios);