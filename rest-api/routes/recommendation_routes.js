/* recommendation routing */
module.exports = function(app) {

    // Import the recommendation controller
    var recommendation_controller = require('../controllers/recommendation_controller')

    // All recommendations
    app.route('/recommendations')
        .get(recommendation_controller.list_all_recommendations)
        .post(recommendation_controller.create_recommendation)

    // Single recommendation
    app.route('/recommendations/:recommendation_id')
        .get(recommendation_controller.read_recommendation)
        .delete(recommendation_controller.remove_recommendation)
};