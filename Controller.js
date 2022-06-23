const express = require('express');
const cors = require('cors');

const {Sequelize} = require('./models');

const models = require('./models');
const { json } = require('express/lib/response');
const res = require('express/lib/response');

const app = express();
app.use(cors());
app.use(express.json());

let cliente = models.Cliente;
let itempedido = models.itemPedido;
let pedido = models.Pedido;
let servico = models.Servico;

app.get('/', function(req, res){
    res.send('Ola, mundo!')
});

// app.get('/servicos',async(req, res)=>{   --- é preciso só uma função pra inclusao
//     await servico.create({
//         nome: "HTML/CSS",
//         descricao: "Paginas estaticas estilizadas",
//         createAt: new Date(),
//         updateAt: new Date()
//     });
//     res.send('Serviço foi criado com sucesso!');
// });

app.post('/servicos',async(req, res)=>{
    await servico.create(
        req.body
    ).then(function(){
        return res.json({
            error: false,
            message: 'Serviço foi criado com sucesso!'
        })
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: 'Foi impossivel se conectar.'
        });
        });
    });
    

app.post('/clientes', async(req,res)=>{
    await cliente.create(
        req.body
    ).then(function(){
        return res.json({
            error: false,
            message: 'Seja bem-vindo(a) a ServicesTI.'
        })
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message:'Cliente criado com sucesso'
        });
        });
    });
    
    app.post('/pedidos', async(req,res)=>{
        await pedido.create(
            req.body
        ).then(function(){
            return res.json({
                error: false,
                message: 'Pedido criado com sucesso'
            })
        }).catch(function(erro){
            return res.status(400).json({
                error: true,
                message: 'Foi impossivel se conectar.'
            });
            });
        });

    app.post('/itempedidos', async(req,res)=>{
        await itempedido.create(
            req.body
        ).then(function(){
            return res.json({
                error: false,
                message: 'Item criado com sucesso'
            })
        }).catch(function(erro){
            return res.status(400).json({
                error: true,
                message: 'Foi impossivel se conectar.'
            });
            });
        });

    app.get('/listaservicos', async(req, res)=>{
        await servico.findAll({
           raw: true
        //    order: [('nome', 'DESC')] //decrescente ASC ascendente
        }).then(function(servicos){
            res.json({servicos})
        });
    });
    app.get('/listaclientes', async(req, res)=>{
        await cliente.findAll({
            raw: true
        }).then(function(clientes){
            res.json({clientes})
        });
    });
    app.get('/listapedidos', async(req, res)=>{
        await pedido.findAll({
            raw: true
        }).then(function(pedidos){
            res.json({pedidos})
        });
    });


    app.get('/ofertaservicos', async (req, res)=>{
        await servico.count('id').then(function(servicos){
            res.json({servicos});
        });
    });

    app.get('/servico/:id', async(req, res)=>{
        await servico.findByPk(req.params.id)
        .then(serv =>{
            return res.json({
                error: false,
                serv
            });
        }).catch(function(erro){
            return res.status(400).json({
                error: true,
                message:'Erro: nao foi possivel conectar'
            });
        });
    });

app.get('/pedidos', function(req,res){
    res.send('Faça seu pedido!')
});

app.get('/servicos', function(req,res){
    res.send('Selecione o serviço desejado.')
});

// app.get('/atualizaservico', async(req, res)=>{
//     await servico.findByPk(1)
//     .then(serv => {
//         serv.nome = 'HTML/CSS/JS';
//         serv.descricao = 'Paginas estaticas e dinamicas estilizadas';
//         serv.save();
//         return res.json({serv});
//     });
// });

app.put('/atualizaservico', async(req, res)=>{
     await servico.update(req.body,{
         where: {id:req.body.id}
     }).then(function(){
         return res.json({
             error: false,
             message: "Serviço alterado com sucesso!"
         }).catch(function(erro){
             return res.status(400).json({
                 error: true,
                 message: "Erro na alteraçao do serviço"
             });
         });
     });
    });

    app.get('/pedidos/:id', async(req, res)=>{
        await pedido.findByPk(req.params.id,{include:[{all: true}]})
        .then(ped=>{
            return res.json({ped})
        })
    })
    app.put('pedidos/:id/editaritem', async(req, res)=>{
        const item={
            quantidade: req.body.quantidade,
            valor: req.body.valor
        };
        if(! await pedido.findByPk(req.params.id)){
            return res.status(400).json({
                error: true,
                message: 'Pedido não foi encontrado'
            });
        };
        if(!await servico.findByPk(req.body.ServicoId)){
            return res.status(400).json({
                erre: true,
                message: "Serviço não encontrado"
            });
        };
        await itempedido.update(item, {
            where: Sequelize.and({ServicoId: req.body.ServicoId},
                {PedidoId: req.params.id})
        }).then(function(itens){
            return res.json({
                error: false,
                message: 'Pedido foi alterado'
            });
        }).catch(function(erro){
            return res.status(400).json({
                error: true,
                message: 'Não foi possivel alterar'
            });
        });
    });
            
    app.get('/excluircliente/:id', async(req, res)=>{
        await cliente.destroy({
            where: {id: req.params.id}
        }).then(function(){
            return res.json({
                error: false,
                message: "Cliente foi excluido com sucesso"
            })
        }).catch(function(erro){
            return res.status(400).json({
                error: true,
                message: "Erro ao excluir o cliente"
            })
        })
    })

let port = process.env.PORT || 3001;

app.listen(port,(req, res)=>{
    console.log('Servidor ativo: http://localhost:3001');
})