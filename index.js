const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

app.post("/pix", async (req, res) => {
  try {
    const valor = Number(req.body.valor);
    const email = req.body.email;

    const response = await axios.post(
      "https://api.mercadopago.com/v1/payments",
      {
        transaction_amount: valor,
        description: "Plano VIP",
        payment_method_id: "pix",
        payer: { email: email }
      },
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.json({
      id: response.data.id,
      qr_code:
        response.data.point_of_interaction.transaction_data.qr_code,
      qr_code_base64:
        response.data.point_of_interaction.transaction_data.qr_code_base64
    });

  } catch (error) {
    res.status(500).json({ erro: "Erro ao gerar Pix" });
  }
});

app.listen(3000, () => {
  console.log("API Pix rodando");
});
