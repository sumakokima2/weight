$(function() {
    const ctx = document.getElementById('weightChart').getContext('2d');
    const weightChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: '体重 (kg)',
                data: [],
                borderColor: 'blue',
                borderWidth: 1,
                fill: false
            }]
        },
        options: {
            responsive: true, // ここを追加
            maintainAspectRatio: false, // ここを追加
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'day',
                        displayFormats: {
                            day: 'yyyy-MM-dd'
                        }
                    },
                    title: {
                        display: true,
                        text: '日にち + 時間'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: '体重 (kg)'
                    }
                }
            }
        }
    });

    function updateChart() {
        const labels = [];
        const data = [];
        $('#weightTable tbody tr').each(function() {
            const date = $(this).find('td').eq(0).text();
            const time = $(this).find('td').eq(1).text().replace(" am"||" pm","");
            const weight = $(this).find('td').eq(2).text();
            console.log(time)
            const dateTimeString = `${date}T${time}:00`;
            console.log(time)
            const dateTime = new Date(dateTimeString);
            if (!isNaN(dateTime)) {
                labels.push(dateTime);
                data.push(weight);
            }
        });
        weightChart.data.labels = labels;
        weightChart.data.datasets[0].data = data;
        weightChart.update();
    }

    function sortTable() {
        const rows = $('#weightTable tbody tr').get();
        rows.sort(function(a, b) {
            const keyA = new Date($(a).children('td').eq(0).text() + 'T' + $(a).children('td').eq(1).text() + ':00');
            const keyB = new Date($(b).children('td').eq(0).text() + 'T' + $(b).children('td').eq(1).text() + ':00');
            return keyA - keyB;
        });
        $.each(rows, function(index, row) {
            $('#weightTable tbody').append(row);
        });
    }

    function bindEditButtons() {
        $(".edit-btn").off("click").on("click", function() {
            const row = $(this).closest('tr');
            const date = row.find('td').eq(0).text();
            const time = row.find('td').eq(1).text();
            const weight = row.find('td').eq(2).text();
            
            $("#edit-date").val(date);
            $("#edit-time").val(time);
            $("#edit-weight").val(weight);
            
            $("#dialog-form").dialog({
                modal: true,
                buttons: {
                    "保存": function () {
                        const newDate = $("#edit-date").val();
                    const newTime = $("#edit-time").val();
                    const newWeight = $("#edit-weight").val();

                    if (newDate === "" || newTime === "" || newWeight === "") {
                        alert("すべてのフィールドに値を入力してください。");
                        return;
                    }
                        row.find('td').eq(0).text($("#edit-date").val());
                        row.find('td').eq(1).text($("#edit-time").val());
                        row.find('td').eq(2).text($("#edit-weight").val());
                        sortTable();
                        updateChart();
                        $(this).dialog("close");
                    },
                    "キャンセル": function() {
                        $(this).dialog("close");
                    }
                }
            });
        });
    }

    bindEditButtons();

    $("#edit-date").datepicker({
        dateFormat: "yy-mm-dd"
    });
    $("#edit-time").timepicker({
        timeFormat: 'h:i a',
        interval: 30,
        dynamic: false,
        dropdown: true,
        scrollbar: true
    });
    $("#add-date").datepicker({
        dateFormat: "yy-mm-dd"
    });
    $("#add-time").timepicker({
        timeFormat: 'h:i a',
        interval: 30,
        dynamic: false,
        dropdown: true,
        scrollbar: true
    });

    $("#add-row-btn").on("click", function() {
        $("#dialog-add-form").dialog({
            modal: true,
            buttons: {
                "追加": function() {
                    const newDate = $("#add-date").val();
                    const newTime = $("#add-time").val();
                    const newWeight = $("#add-weight").val();

                    if (newDate === "" || newTime === "" || newWeight === "") {
                        alert("すべてのフィールドに値を入力してください。");
                        return;
                    }

                    const newRow = `<tr>
                        <td>${newDate}</td>
                        <td>${newTime}</td>
                        <td>${newWeight}</td>
                        <td><button class="edit-btn">edit</button></td>
                    </tr>`;
                    $("#weightTable tbody").append(newRow);
                    bindEditButtons();
                    sortTable();
                    updateChart();
                    $(this).dialog("close");
                },
                "キャンセル": function() {
                    $(this).dialog("close");
                }
            }
        });
    });

    // 初期データのロード時にチャートを更新
    updateChart();
});
