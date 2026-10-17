const formVeterinario = document.getElementById('formVeterinario');
const tablaVeterinarios = document.getElementById('tablaVeterinarios');
const btnCancelarVet = document.getElementById('btnCancelarVet');

// Leer datos de LocalStorage
function getVeterinarios() {
    return JSON.parse(localStorage.getItem('veterinarios')) || [];
}

// Guardar datos en LocalStorage
function saveVeterinarios(veterinarios) {
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
function renderizarTablaVet() {
    const veterinarios = getVeterinarios();
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
formVeterinario.addEventListener('submit', function(e) {
    e.preventDefault();
    const veterinarios = getVeterinarios();
    
    // Capturar datos y transformarlos en objeto
    const vetData = {
        idVeterinario: document.getElementById('idVeterinario').value || generarId(),
        matricula: parseInt(document.getElementById('matricula').value),
        nombre: document.getElementById('nombre').value,
        especializacion: document.getElementById('especializacion').value,
        valorConsulta: parseFloat(document.getElementById('valorConsulta').value)
    };

    const idActual = document.getElementById('idVeterinario').value;

    if (idActual) {
        // Modificación
        const index = veterinarios.findIndex(v => v.idVeterinario === idActual);
        veterinarios[index] = vetData;
    } else {
        // Alta
        veterinarios.push(vetData);
    }

    saveVeterinarios(veterinarios);
    formVeterinario.reset();
    document.getElementById('idVeterinario').value = '';
    btnCancelarVet.classList.add('d-none');
    renderizarTablaVet();
});

// Eliminar Veterinario
function eliminarVeterinario(id) {
    if(confirm("¿Está seguro que desea eliminar este veterinario?")) { // Previa confirmación
        let veterinarios = getVeterinarios();
        veterinarios = veterinarios.filter(v => v.idVeterinario !== id);
        saveVeterinarios(veterinarios);
        renderizarTablaVet();
    }
}

// Cargar datos al formulario para editar
function editarVeterinario(id) {
    const veterinarios = getVeterinarios();
    const vet = veterinarios.find(v => v.idVeterinario === id);
    
    document.getElementById('idVeterinario').value = vet.idVeterinario;
    document.getElementById('matricula').value = vet.matricula;
    document.getElementById('nombre').value = vet.nombre;
    document.getElementById('especializacion').value = vet.especializacion;
    document.getElementById('valorConsulta').value = vet.valorConsulta;

    btnCancelarVet.classList.remove('d-none');
}

// Cancelar edición
btnCancelarVet.addEventListener('click', () => {
    formVeterinario.reset();
    document.getElementById('idVeterinario').value = '';
    btnCancelarVet.classList.add('d-none');
});

// Cargar tabla al iniciar
document.addEventListener('DOMContentLoaded', renderizarTablaVet);