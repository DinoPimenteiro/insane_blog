/*Como o middleware atua no meio das requisições, ele funciona como um intermediário
entre as operações, neste caso funcionando como uma validação. Então ele barra o fluxo
para realizar o procedimento, por isso existe esse terceiro parâmetro chamado next, ele serve
para continuar com o fluxo de dados.  */

const adminAuth = (req, res, next) => {
  if (req.session.user != undefined){
    next();
  } else {
    res.redirect("/login");
  }
}

export default adminAuth;