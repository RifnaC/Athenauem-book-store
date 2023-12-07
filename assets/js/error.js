if(adminAuthorization){
    Swal.fire({
        icon: 'error',
        title: 'Forbidden',
        text: 'Admin access required.',
        confirmButttonColor: '#15778C',
    }).then(() => {
        history.back();
    });
}

if(vendorAuthorization){
    Swal.fire({
        icon: 'error',
        title: 'Forbidden',
        text: 'Admin access required.',
        confirmButttonColor: '#15778C',
    }).then(() => {
        history.back();
    });
}