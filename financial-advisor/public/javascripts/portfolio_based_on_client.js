$(document).ready(function() {
    $('#client_id').change(function () {
        let client_id = $(this).val();
        let options = portfolios.filter(function (elem) {
            return (elem.client_id == client_id);
        })
        // Clear options
        $('#portfolio_id').empty()
        console.log('Filtered')
        $.each(options, function(key, value) {
            let opt_string = '<option value=' + value.portfolio_id + '>' + '(' + value.portfolio_id + ') ' + value.strategy
            $('#portfolio_id').append(opt_string)
        })
    });
});