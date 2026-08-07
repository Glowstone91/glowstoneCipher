# Cifra de Glowstone

> Cifra experimental de chave rotativa e seeds dinâmicas, inspirada na máquina Enigma da Segunda Guerra Mundial.

## Sobre o Projeto

A **Cifra de Glowstone** é um algoritmo criptográfico experimental desenvolvido para fins educacionais e conceituais.

O projeto utiliza um sistema de **seeds dinâmicas**, **estado rotativo** e **operações matemáticas modulares** para gerar uma cifra que altera seu comportamento conforme os parâmetros utilizados.

A proposta é criar uma experiência semelhante aos sistemas históricos de criptografia, onde uma mensagem depende não apenas de uma chave, mas também de configurações temporais e regras compartilhadas entre os operadores.

🔗 **Demonstração online:**  
https://glowstone91.github.io/glowstoneCipher/

> **Importante:** Este projeto não deve ser utilizado para proteger informações reais. Ele foi desenvolvido exclusivamente para estudo e experimentação.

---

# Demonstração

A Cifra de Glowstone possui uma interface web onde é possível gerar seeds, criptografar mensagens e descriptografá-las utilizando os mesmos parâmetros.

## Mensagem curta

Exemplo de uma frase criptografada utilizando a Cifra de Glowstone.

![Mensagem curta](Image/not_so_long_sentence.png)

---

## Mensagem longa

O algoritmo também suporta mensagens maiores, mantendo a variação dinâmica do estado interno durante todo o processo.

![Mensagem longa](Image/really_long_sentence.png)

---

# Funcionamento da Cifra

A criptografia utiliza um conjunto personalizado de **100 caracteres**, identificados por índices de `0` a `99`.

O processo de cifragem utiliza:

- Uma seed gerada através da data.
- Uma seed gerada através da senha.
- Um multiplicador dinâmico.
- Um estado interno atualizado a cada caractere.
- Operações matemáticas em módulo `100`.

---

# Conjunto de Caracteres

O sistema reconhece exatamente 100 caracteres:

## Letras maiúsculas

```
A-Z
```

## Letras minúsculas

```
a-z
```

## Números

```
0-9
```

## Símbolos

```
@$*!?-_/()[]{}
```

## Caracteres acentuados

```
ÁÀÃÂáàãâÕÓÔõóôÉÊéêÍíÚúç
```

## Espaço

```
Índice 99
```

Como o espaço também participa da cifragem, ele é transformado em outro caractere durante o processo.

Por esse motivo, mensagens criptografadas não possuem espaços visíveis.

---

# Geração da Seed da Data

A data utilizada como parâmetro passa por um processo de transformação.

Exemplo:

```
06/08/2026
```

Primeiro, os caracteres não numéricos são removidos:

```
[6,8,2,2,6]
```

Depois, cada número é multiplicado pelo próximo, sendo que o último multiplica pelo primeiro:

```
6 × 8 = 48
8 × 2 = 16
2 × 2 = 4
2 × 6 = 12
6 × 6 = 36
```

Os valores originais e os resultados são intercalados:

```
Seed da Data

64881624212636
```

---

# Geração da Seed da Senha

Cada caractere da senha é convertido para seu índice dentro da tabela de caracteres e recebe `+1`.

Exemplo:

Senha:

```
GLOWSTONE
```

Conversão:

```
G = 7
L = 12
O = 15
W = 23
S = 19
T = 20
O = 15
N = 14
E = 5
```

Resultado:

```
Seed da Senha

[7,12,15,23,19,20,15,14,5]
```

---

# Multiplicador Dinâmico

O multiplicador é responsável pela variação do estado interno da cifra.

Ele utiliza:

- Data atual.
- Tamanho da senha.
- Representação binária do tamanho da senha.

Exemplo:

Senha:

```
GLOWSTONE
```

Quantidade de caracteres:

```
9
```

Representação binária:

```
1001
```

Métricas:

Quantidade total de bits:

```
D = 4
```

Quantidade de bits com valor `1`:

```
U = 2
```

Fator:

```
F = D × U

F = 4 × 2

F = 8
```

Soma da data:

```
Dia + Mês

06 + 08 = 14
```

Multiplicador final:

```
((S + F) × 2) + 1

((14 + 8) × 2) + 1

= 45
```

O resultado sempre será um número ímpar, evitando determinados padrões matemáticos dentro do módulo `100`.

---

# Seed Final

A Seed Final é criada combinando:

- Seed da Data.
- Seed da Senha.

A combinação ocorre através da soma elemento por elemento.

Caso uma das seeds seja menor, seus valores são repetidos até completar o tamanho necessário.

---

# Processo de Criptografia Rotativa

Para cada caractere da mensagem:

## Atualização do Estado

```
EstadoNovo =
(EstadoAtual × Multiplicador + ChaveSeed) mod 100
```

## Conversão do Caractere

```
CaractereCifrado =
(PosiçãoOriginal + EstadoNovo) mod 100
```

O estado é alterado após cada caractere, fazendo com que cada posição da mensagem utilize um deslocamento diferente.
---

# Tecnologias Utilizadas

- **HTML5**
  - Estrutura da aplicação.

- **CSS3**
  - Interface e estilização.

- **JavaScript (ES6+)**
  - Implementação do algoritmo de criptografia.

- **Bootstrap 5**
  - Componentes responsivos.

- **Bootstrap Icons**
  - Elementos visuais da interface.

---

# Lore e Contexto Fictício

A Cifra de Glowstone foi concebida dentro de um cenário fictício de comunicação tática, inspirado nos métodos utilizados por sistemas históricos de criptografia, como a máquina Enigma.

Embora o algoritmo seja totalmente autoral, a ambientação busca reproduzir a ideia de mensagens transmitidas entre operadores que compartilham regras e parâmetros secretos.

## O Marco Zero

Antes do início de uma operação, todos os operadores definem uma data inicial secreta.

Exemplo:

```
09/02/1378
```

A cada novo dia, todos os operadores avançam essa data em um dia, alterando automaticamente os parâmetros utilizados pela cifra.

---

## O Livro Secreto

Todos os operadores possuem o mesmo livro físico, utilizado como fonte para gerar a senha.

A senha pode ser obtida através de regras previamente combinadas, como:

- Extrair nomes próprios de um capítulo específico.
- Utilizar palavras em determinada ordem.
- Aplicar métodos definidos entre os participantes.

Como a senha nunca é enviada diretamente, apenas quem possui o livro e conhece o método de extração consegue reproduzi-la.

---

## Objetos de Despiste

Para evitar que o livro desperte suspeitas caso vários agentes carreguem a mesma edição, cada operador também leva consigo objetos aparentemente aleatórios.

Exemplos:

- Um relógio sem ponteiros.
- Uma pedra gravada.
- Um par de meias diferentes.

Esses objetos funcionam apenas como distração, desviando a atenção do verdadeiro elemento importante: o livro.

---

## Inspiração na Enigma

Assim como a máquina Enigma utilizava configurações diárias compartilhadas entre seus operadores, a Cifra de Glowstone altera completamente seu comportamento sempre que seus parâmetros mudam.

Cada novo dia representa uma nova configuração do sistema, exigindo que todos os participantes utilizem exatamente os mesmos dados para que a comunicação continue funcionando.

---

# Aviso de Segurança

A Cifra de Glowstone é um projeto **experimental**.

Ela não passou por análises profissionais de criptografia e pode conter:

- Padrões estatísticos.
- Vulnerabilidades matemáticas.
- Falhas ainda não identificadas.

**Não utilize esta cifra para proteger:**

- Senhas reais.
- Informações financeiras.
- Dados pessoais.
- Sistemas em produção.

Este projeto foi desenvolvido exclusivamente para fins educacionais, estudo e experimentação.

---

# Licença

Este projeto está licenciado sob a **Licença MIT**.

Você é livre para estudar, modificar e adaptar o código para seus próprios experimentos.

---

# Secret Archive

Uma transmissão criptografada utilizando a própria **Cifra de Glowstone** está disponível neste repositório.

**Será que você consegue descriptografá-la?**

🔐 **Arquivo interceptado:**

➡️ **[README_INTERCEPTED_ENCRYPTED.md](README_INTERCEPTED_ENCRYPTED.md)**
