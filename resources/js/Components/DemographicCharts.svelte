<script>
    import { onMount } from 'svelte';
    import Chart from 'chart.js/auto';

    export let genderData = { labels: [], data: [] };
    export let ageData = { labels: [], data: [] };

    let genderCanvas;
    let ageCanvas;
    let genderChart;
    let ageChart;

    onMount(() => {
        createGenderChart();
        createAgeChart();

        return () => {
            if (genderChart) genderChart.destroy();
            if (ageChart) ageChart.destroy();
        };
    });

    $: if (genderChart && genderData) {
        updateGenderChart();
    }

    $: if (ageChart && ageData) {
        updateAgeChart();
    }

    function createGenderChart() {
        const ctx = genderCanvas.getContext('2d');
        genderChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: genderData.labels,
                datasets: [{
                    data: genderData.data,
                    backgroundColor: [
                        '#3B82F6', // Blue for Laki-laki
                        '#EC4899'  // Pink for Perempuan
                    ],
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((context.parsed / total) * 100).toFixed(1);
                                return `${context.label}: ${context.parsed} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    function createAgeChart() {
        const ctx = ageCanvas.getContext('2d');
        ageChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ageData.labels,
                datasets: [{
                    label: 'Jumlah Responden',
                    data: ageData.data,
                    backgroundColor: '#10B981',
                    borderColor: '#059669',
                    borderWidth: 1,
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `Jumlah: ${context.parsed.y} responden`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        },
                        grid: {
                            color: '#E5E7EB'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    function updateGenderChart() {
        genderChart.data.labels = genderData.labels;
        genderChart.data.datasets[0].data = genderData.data;
        genderChart.update();
    }

    function updateAgeChart() {
        ageChart.data.labels = ageData.labels;
        ageChart.data.datasets[0].data = ageData.data;
        ageChart.update();
    }
</script>

<div class="demographic-charts">
    <div class="charts-container">
        <!-- Gender Distribution Chart -->
        <div class="chart-card">
            <div class="chart-header">
                <h3 class="chart-title">Distribusi Jenis Kelamin</h3>
                <p class="chart-subtitle">Persentase responden berdasarkan jenis kelamin</p>
            </div>
            <div class="chart-content">
                <canvas bind:this={genderCanvas} width="300" height="200"></canvas>
            </div>
        </div>

        <!-- Age Distribution Chart -->
        <div class="chart-card">
            <div class="chart-header">
                <h3 class="chart-title">Distribusi Usia</h3>
                <p class="chart-subtitle">Jumlah responden berdasarkan kelompok usia</p>
            </div>
            <div class="chart-content">
                <canvas bind:this={ageCanvas} width="300" height="200"></canvas>
            </div>
        </div>
    </div>
</div>

<style>
    .demographic-charts {
        margin-bottom: 2rem;
    }

    .charts-container {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1.5rem;
    }

    .chart-card {
        background: white;
        border-radius: 0.75rem;
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
        border: 1px solid #E5E7EB;
        overflow: hidden;
    }

    .chart-header {
        padding: 1.5rem 1.5rem 1rem 1.5rem;
        border-bottom: 1px solid #F3F4F6;
    }

    .chart-title {
        font-size: 1.125rem;
        font-weight: 600;
        color: #1F2937;
        margin: 0 0 0.25rem 0;
    }

    .chart-subtitle {
        font-size: 0.875rem;
        color: #6B7280;
        margin: 0;
    }

    .chart-content {
        padding: 1rem 1.5rem 1.5rem 1.5rem;
        height: 250px;
        position: relative;
    }

    @media (max-width: 768px) {
        .charts-container {
            grid-template-columns: 1fr;
            gap: 1rem;
        }
        
        .chart-content {
            height: 200px;
        }
    }
</style>