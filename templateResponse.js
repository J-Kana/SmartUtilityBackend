const response = (status, message, data, autch, res) => {
    res.status(status).json({
        status: status,
        message: message,
        data:data,
        autch:autch
    })
}
module.exports = response
