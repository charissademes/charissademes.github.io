<?php
// Fetch personal records from API
$api_url = "https://speedskatingresults.com/api/json/personal_records.php?skater=92774";
$response = file_get_contents($api_url);
$records = json_decode($response, true);
?>

<!DOCTYPE html>
<html>
<head>
    <title>Charissa de Mes - Speedskater</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background: url('charissa.png') no-repeat center center fixed;
            background-size: cover;
        }
        .overlay {
            background-color: rgba(255, 255, 255, 0.9);
            padding: 30px;
            margin: 50px auto;
            max-width: 800px;
            border-radius: 15px;
            text-align: center;
        }
        img {
            width: 200px;
            border-radius: 15px;
        }
        table {
            margin: 20px auto;
            border-collapse: collapse;
            width: 100%;
        }
        th, td {
            padding: 10px;
            border-bottom: 1px solid #ddd;
        }
        th {
            background-color: #f2f2f2;
        }
        h1, h2 {
            color: #333;
        }
    </style>
</head>
<body>
    <div class="overlay">
        <img src="charissa.png" alt="Charissa de Mes">
        <h1>Charissa de Mes</h1>
        <p><strong>Age:</strong> 20</p>
        <p><strong>Category:</strong> Junior A</p>
        <p>Charissa de Mes is a talented Dutch speedskater representing Schaats Federatie Alkmaar. Known for her dedication and remarkable performances, she competes in national and international events, continually improving her personal records.</p>

        <h2>Personal Records</h2>
        <?php if ($records && isset($records['records'])): ?>
            <table>
                <tr>
                    <th>Distance</th>
                    <th>Time</th>
                    <th>Date</th>
                    <th>Location</th>
                </tr>
                <?php foreach ($records['records'] as $record): ?>
                    <tr>
                        <td><?php echo htmlspecialchars($record['distance']); ?></td>
                        <td><?php echo htmlspecialchars($record['time']); ?></td>
                        <td><?php echo htmlspecialchars($record['date']); ?></td>
                        <td><?php echo htmlspecialchars($record['location']); ?></td>
                    </tr>
                <?php endforeach; ?>
            </table>
        <?php else: ?>
            <p>Unable to load personal records at this time.</p>
        <?php endif; ?>
    </div>
</body>
</html>
