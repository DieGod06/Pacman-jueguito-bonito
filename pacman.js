const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
canvas.width = innerWidth
canvas.height = innerHeight

class Perimetro {
    static width = 40
    static height = 40
    constructor( {position, image} ) {
      this.position = position
      this.width = 40
      this.height = 40
      this.image = image
    }

    draw() {
       // c.fillStyle = 'blue'
        // c.fillRect(this.position.x, this.position.y, this.width, this.height)
    
        c.drawImage(this.image, this.position.x, this.position.y)
    } 
}

class Jugador {
    constructor({ position, velocity}) {
        this.position = position
        this.velocity = velocity
        this.radius = 15
        this.radians = 0.75
        this.abrircerrar = 0.12
        this.rotation = 0
    }

    draw() {
        c.save()
        c.translate(this.position.x, this.position.y)
        c.rotate(this.rotation)
        c.translate(-this.position.x, -this.position.y)
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, this.radians, Math.PI * 2 - this.radians)
        c.lineTo(this.position.x, this.position.y)
        c.fillStyle = 'yellow'
        c.fill()
        c.closePath()
        c.restore()
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if(this.radians < 0 || this.radians > .75) this.abrircerrar = -this.abrircerrar
        this.radians += this.abrircerrar
    }
}

class Fantasma {
    static speed = 2
    constructor({ position, velocity, color = 'red'}) {
        this.position = position
        this.velocity = velocity
        this.radius = 15
        this.color = color
        this.prevCollisions = []
        this.speed = 2
        this.asustado = false
    }

    draw() {
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = this.asustado ? 'blue' : this.color
        c.fill()
        c.closePath()
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}

class Punto {
    constructor({ position}) {
        this.position = position
        this.radius = 3
    }

    draw() {
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = 'white'
        c.fill()
        c.closePath()
    }
}

class PowerUp {
    constructor({ position}) {
        this.position = position
        this.radius = 8
    }

    draw() {
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = 'white'
        c.fill()
        c.closePath()
    }
}

const puntos = []
const perimetros =  []
const powerUps = []
const fantasmas = [
    new Fantasma({
        position: {
            x: Perimetro.width * 6 + Perimetro.width / 2,
            y: Perimetro.height + Perimetro.height / 2
        },
        velocity: {
            x: Fantasma.speed,
            y: 0
        }
    }),
    new Fantasma({
        position: {
            x: Perimetro.width * 6 + Perimetro.width / 2,
            y: Perimetro.height * 3 + Perimetro.height / 2
        },
        velocity: {
            x: Fantasma.speed,
            y: 0
        },
        color: 'green'
    })
]
const jugador = new Jugador({
    position: {
        x: Perimetro.width + Perimetro.width / 2,
        y: Perimetro.height + Perimetro.height / 2
    },
    velocity: {
      x:0,
      y:0  
    }
})
const keys = {
    w: {
        presionada: false
    },
    a: {
        presionada: false
    },
    s: {
        presionada: false
    },
    d: {
        presionada: false
    }
}

let ultimaKey = ''
const mapa = [
    ['1', '-', '-', '-', '-', '-', '-', '-', '-', '-', '2'],
    ['|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|'],
    ['|', '.', 'b', '.', '[', '7', ']', '.', 'b', '.', '|'],
    ['|', '.', '.', '.', '.', '_', '.', '.', '.', '.', '|'],
    ['|', '.', '[', ']', '.', '.', '.', '[', ']', '.', '|'],
    ['|', '.', '.', '.', '.', '^', '.', '.', '.', '.', '|'],
    ['|', '.', 'b', '.', '[', '+', ']', '.', 'b', '.', '|'],
    ['|', '.', '.', '.', '.', '_', '.', '.', '.', '.', '|'],
    ['|', '.', '[', ']', '.', '.', '.', '[', ']', '.', '|'],
    ['|', '.', '.', '.', '.', '^', '.', '.', '.', '.', '|'],
    ['|', '.', 'b', '.', '[', '5', ']', '.', 'b', '.', '|'],
    ['|', '.', '.', '.', '.', '.', '.', '.', '.', 'p', '|'],
    ['4', '-', '-', '-', '-', '-', '-', '-', '-', '-', '3']
    ]
function crearImagen(src){
    const image = new Image()
    image.src = src
    return image
}

mapa.forEach((fila, i) => {
    fila.forEach((simbolo, j) => {
        switch (simbolo) {
            case '-':
                perimetros.push(new Perimetro({
                    position: {
                        x: Perimetro.width *j,
                        y: Perimetro.height * i
                    
                    },
                    image: crearImagen('./Recursos/pipeHorizontal.png')
                })
                )
                break
            case '|':
                perimetros.push(new Perimetro({
                    position: {
                        x: Perimetro.width *j,
                        y: Perimetro.height * i
                    
                    },
                    image: crearImagen('./Recursos/pipeVertical.png')
                })
                )
                break
            case '1':
                perimetros.push(new Perimetro({
                    position: {
                        x: Perimetro.width *j,
                        y: Perimetro.height * i
                    
                    },
                    image: crearImagen('./Recursos/pipeCorner1.png')
                })
                )
                break
            case '2':
                perimetros.push(new Perimetro({
                    position: {
                        x: Perimetro.width *j,
                        y: Perimetro.height * i
                    
                    },
                    image: crearImagen('./Recursos/pipeCorner2.png')
                })
                )
                break
            case '3':
                perimetros.push(new Perimetro({
                    position: {
                        x: Perimetro.width *j,
                        y: Perimetro.height * i
                    
                    },
                    image: crearImagen('./Recursos/pipeCorner3.png')
                })
                )
                break
            case '4':
                perimetros.push(new Perimetro({
                    position: {
                        x: Perimetro.width *j,
                        y: Perimetro.height * i
                    
                    },
                    image: crearImagen('./Recursos/pipeCorner4.png')
                })
                )
                break
            case 'b':
                perimetros.push(new Perimetro({
                    position: {
                        x: Perimetro.width *j,
                        y: Perimetro.height * i
                    
                    },
                    image: crearImagen('./Recursos/block.png')
                })
                )
                break
            case '[':
                perimetros.push(new Perimetro({
                    position: {
                        x: Perimetro.width *j,
                        y: Perimetro.height * i
                    
                    },
                    image: crearImagen('./Recursos/capLeft.png')
                })
                )
                break
            case ']':
                perimetros.push(new Perimetro({
                    position: {
                        x: Perimetro.width *j,
                        y: Perimetro.height * i
                    
                    },
                    image: crearImagen('./Recursos/capRight.png')
                })
                )
                break
            case '_':
                perimetros.push(new Perimetro({
                    position: {
                        x: Perimetro.width *j,
                        y: Perimetro.height * i
                    
                    },
                    image: crearImagen('./Recursos/capBottom.png')
                })
                )
                break
            case '^':
                perimetros.push(new Perimetro({
                    position: {
                        x: Perimetro.width *j,
                        y: Perimetro.height * i
                    
                    },
                    image: crearImagen('./Recursos/capTop.png')
                })
                )
                break
            case '+':
                perimetros.push(new Perimetro({
                    position: {
                        x: Perimetro.width *j,
                        y: Perimetro.height * i
                    
                    },
                    image: crearImagen('./Recursos/pipeCross.png')
                })
                )
                break
            case '5':
                perimetros.push(new Perimetro({
                    position: {
                        x: Perimetro.width *j,
                        y: Perimetro.height * i
                    
                    },
                    color: 'blue',
                    image: crearImagen('./Recursos/pipeConnectorTop.png')
                })
                )
                break
            case '6':
                perimetros.push(new Perimetro({
                    position: {
                        x: Perimetro.width *j,
                        y: Perimetro.height * i
                    
                    },
                    color: 'blue',
                    image: crearImagen('./Recursos/pipeConnectorRight.png')
                })
                )
                break
            case '7':
                perimetros.push(new Perimetro({
                    position: {
                        x: Perimetro.width *j,
                        y: Perimetro.height * i
                    
                    },
                    color: 'blue',
                    image: crearImagen('./Recursos/pipeConnectorBottom.png')
                })
                )
                break
            case '8':
                perimetros.push(new Perimetro({
                    position: {
                        x: Perimetro.width *j,
                        y: Perimetro.height * i
                    
                    },
                    image: crearImagen('./Recursos/pipeConnectorLeft.png')
                })
                )
                break
            case '.':
                puntos.push(new Punto({
                    position: {
                        x: j * Perimetro.width + Perimetro.width / 2,
                        y: i * Perimetro.height + Perimetro.height / 2
                    
                    }                    
                })
                )
                break
            case 'p':
                    powerUps.push(new PowerUp({
                        position: {
                            x: j * Perimetro.width + Perimetro.width / 2,
                            y: i * Perimetro.height + Perimetro.height / 2
                        
                        }                    
                    })
                    )
                    break
        }
    })
})

function colisionPacmanconRectangulo({circle, rectangle}) {
    const padding = Perimetro.width / 2 - circle.radius - 1
    return ( 
    circle.position.y - circle.radius + circle.velocity.y <= rectangle.position.y + rectangle.height + padding && 
    circle.position.x + circle.radius + circle.velocity.x >= rectangle.position.x - padding && 
    circle.position.y + circle.radius + circle.velocity.y >= rectangle.position.y - padding && 
    circle.position.x - circle.radius + circle.velocity.x<= rectangle.position.x + rectangle.width + padding
)}

let animationId
function animate() {
    animationId = requestAnimationFrame(animate)
    c.clearRect(0, 0, canvas.width, canvas.height)

    if (keys.w.presionada && ultimaKey === 'w'){
        for (let i = 0; i < perimetros.length; i++) {
        const perimetro = perimetros [i]
        if (colisionPacmanconRectangulo({
            circle: {...jugador, velocity: {
                x:0,
                y:-5
            }},
            rectangle: perimetro   
        })
        ) {
            jugador.velocity.y= 0
            break
          } else {
            jugador.velocity.y= -5
        }
    }
    } else if (keys.a.presionada && ultimaKey === 'a') {
        for (let i = 0; i < perimetros.length; i++) {
            const perimetro = perimetros [i]
            if (colisionPacmanconRectangulo({
                circle: {...jugador, velocity: {
                    x:-5,
                    y:0
                }},
                rectangle: perimetro   
            })
            ) {
                jugador.velocity.x= 0
                break
              } else {
                jugador.velocity.x= -5
            }
        }
    } else if (keys.s.presionada && ultimaKey === 's') {
        for (let i = 0; i < perimetros.length; i++) {
            const perimetro = perimetros [i]
            if (colisionPacmanconRectangulo({
                circle: {...jugador, velocity: {
                    x:0,
                    y:5
                }},
                rectangle: perimetro   
            })
            ) {
                jugador.velocity.y= 0
                break
              } else {
                jugador.velocity.y= 5
            }
        }
    } else if (keys.d.presionada && ultimaKey === 'd') {
        for (let i = 0; i < perimetros.length; i++) {
            const perimetro = perimetros [i]
            if (colisionPacmanconRectangulo({
                circle: {...jugador, velocity: {
                    x:5,
                    y:0
                }},
                rectangle: perimetro   
            })
            ) {
                jugador.velocity.x= 0
                break
              } else {
                jugador.velocity.x= 5
            }
        }
    } 

//choque entre fantasmas y pacman, se dieron duro
for (let i = fantasmas.length - 1; 0 <= i; i--){
    const fantasma = fantasmas [i]

//fantasma toca a pacman >:V
if (Math.hypot(fantasma.position.x - jugador.position.x, fantasma.position.y - jugador.position.y) < fantasma.radius + jugador.radius) {

    if (fantasma.asustado){
        fantasmas.splice(i, 1)
    } else {
        cancelAnimationFrame(animationId)
        console.log('you lose')
    }
}
}

// ganaste pai
if (puntos.length === 0) {
    console.log('you win')
    cancelAnimationFrame(animationId)
}


//poderes (powerUp)

    for (let i = powerUps.length - 1; 0 <= i; i--){
        const powerUp = powerUps [i]
        powerUp.draw()

//pacman come el powerUp

        if (Math.hypot(powerUp.position.x - jugador.position.x, powerUp.position.y - jugador.position.y) < powerUp.radius + jugador.radius) {
            powerUps.splice(i, 1)

//transformación fantasmas
            fantasmas.forEach(fantasma => {
                fantasma.asustado = true

                setTimeout (() => {
                    fantasma.asustado = false
            }, 5000)
            })
        }
    }
//tocando puntos
    for (let i = puntos.length - 1; 0 <= i; i--){
        const punto = puntos[i]
        punto.draw()

        if (Math.hypot(punto.position.x - jugador.position.x, punto.position.y - jugador.position.y) < punto.radius + jugador.radius) {
            puntos.splice(i, 1)
            console.log('tocando')
        }
    }
          
    perimetros.forEach((perimetro) => {
        perimetro.draw()

        if (
            colisionPacmanconRectangulo({
                circle: jugador,
                rectangle: perimetro   
            })
        ) {
                jugador.velocity.x = 0
                jugador.velocity.y = 0
            }
    })
    jugador.update()

    fantasmas.forEach((fantasma) => {
        fantasma.update()

        //fantasma toca a pacman >:V
        if (Math.hypot(fantasma.position.x - jugador.position.x, fantasma.position.y - jugador.position.y) < fantasma.radius + jugador.radius && !fantasma.asustado) {
            cancelAnimationFrame(animationId)
            console.log('you lose')
        }

        const colisiones = []
        perimetros.forEach(perimetro => {
            if (
                !colisiones.includes('right') &&
                colisionPacmanconRectangulo({
                circle: {...fantasma, velocity: {
                    x:fantasma.speed,
                    y:0
                }},
                rectangle: perimetro   
            })
            ) {
                colisiones.push('right')
            }
            if (
                !colisiones.includes('left') &&
                colisionPacmanconRectangulo({
                circle: {...fantasma, velocity: {
                    x:-fantasma.speed,
                    y:0
                }},
                rectangle: perimetro   
            })
            ) {
                colisiones.push('left')
            }
            if (
                !colisiones.includes('up') &&
                colisionPacmanconRectangulo({
                circle: {...fantasma, velocity: {
                    x:0,
                    y:-fantasma.speed
                }},
                rectangle: perimetro   
            })
            ) {
                colisiones.push('up')
            }      
            if (
                !colisiones.includes('down') &&
                colisionPacmanconRectangulo({
                circle: {...fantasma, velocity: {
                    x:0,
                    y: fantasma.speed
                }},
                rectangle: perimetro   
            })
            ) {
                colisiones.push('down')
            }                 
        })

        if (colisiones.length > fantasma.prevCollisions.length)
        fantasma.prevCollisions = colisiones

        if (JSON.stringify(colisiones) !== JSON.stringify (fantasma.prevCollisions)) {
        //console.log('gogo')

        if (fantasma.velocity.x > 0) fantasma.prevCollisions.push('right')
        else if (fantasma.velocity.x < 0) fantasma.prevCollisions.push('left')
        else if (fantasma.velocity.y < 0) fantasma.prevCollisions.push('up')
        else if (fantasma.velocity.y > 0) fantasma.prevCollisions.push('down')

        console.log(colisiones)
        console.log(fantasma.prevCollisions)

        const caminos = fantasma.prevCollisions.filter((colision) => {
            return !colisiones.includes(colision)
        })
        console.log ({ caminos })

        const direccion = caminos[Math.floor(Math.random() * caminos.length)]

        console.log({direccion})

        switch (direccion) {
            case 'down':
                fantasma.velocity.y = fantasma.speed
                fantasma.velocity.x = 0
                break

                case 'up':
                fantasma.velocity.y = -fantasma.speed
                fantasma.velocity.x = 0
                break

                case 'right':
                fantasma.velocity.y = 0
                fantasma.velocity.x = fantasma.speed
                break

                case 'left':
                fantasma.velocity.y = 0
                fantasma.velocity.x = -fantasma.speed
                break
        }

        fantasma.prevCollisions = []
        }
        //console.log(colisiones)
    })     
    
    if (jugador.velocity.x > 0) jugador.rotation = 0
    else if (jugador.velocity.x < 0) jugador.rotation = Math.PI
    else if (jugador.velocity.y > 0) jugador.rotation = Math.PI / 2
    else if (jugador.velocity. y < 0) jugador.rotation = Math.PI * 1.5
} //final de animación :)

animate()

addEventListener('keydown', ({ key }) => {   
    switch (key){
        case 'w':
        keys.w.presionada = true
        ultimaKey = 'w'
        break
        case 'a':
        keys.a.presionada = true 
        ultimaKey = 'a'       
        break
        case 's':
        keys.s.presionada = true
        ultimaKey = 's'
        break
        case 'd':
        keys.d.presionada = true
        ultimaKey = 'd'
        break
   }
   
})

addEventListener('keyup', ({ key }) => {   
    switch (key){
        case 'w':
        keys.w.presionada = false
        break
        case 'a':
        keys.a.presionada = false       
        break
        case 's':
        keys.s.presionada = false
        break
        case 'd':
        keys.d.presionada = false
        break
   }
   console.log(keys.d.presionada)
   console.log(keys.s.presionada)
})