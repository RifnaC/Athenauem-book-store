function generatePDF(name) {
    // Create a new jsPDF instance
    window.jsPDF = window.jspdf.jsPDF;
    const pdf = new jsPDF();
    // Use html2canvas to convert HTML content to a canvas
    html2canvas(document.querySelector('.print')).then(canvas => {
        // Add the canvas content to the PDF
        const imgData = canvas.toDataURL('image/png');
        pdf.addImage(imgData, 'PNG', 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());

        // Save the PDF
        pdf.save(`${name}.pdf`);
    });
}