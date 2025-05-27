// ChatGPT
function download2DArray(data) {
    // Convert array to CSV string
    const csvContent = data.map(row => row.map(String)
            .map(value => `"${value.replace(/"/g, '""')}"`)  // CSV-safe quoting
            .join(',')
    ).join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    // Create a URL that is clicked to download the URL
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}