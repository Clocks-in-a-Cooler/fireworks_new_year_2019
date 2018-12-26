//canvas and its context
var canvas = document.querySelector("canvas");
var ctxt   = canvas.getContext("2d");
var width  = window.innerWidth;
var height = window.innerHeight;

function random_number(start, end) {
    var adder      = Math.min(start, end);
    var multiplier = Math.abs(start - end);
    
    return Math.floor(Math.random() * multiplier + adder);
}

function random_element(array) {
    return array[random_number(0, array.length)];
}

//handling animation
var last_time = null;
var lapse     = 0;

function animate(time) {
    if (last_time == null) {
        lapse = 0;
    } else {
        lapse = time - last_time;
    }
    
    last_time = time;
    
    draw_frame(lapse);
    
    requestAnimationFrame(animate);
}

function draw_frame(lapse) {
    ctxt.fillStyle = get_colour(background_colour, 0.1);
    ctxt.fillRect(0, 0, window.innerWidth, window.innerHeight);
    
    entities = entities.filter((e) => { return e.active; });
    
    entities.forEach((e) => {
        e.get_new_position(lapse);
        e.draw(ctxt);
    });
    
    entities.push(new Firework_rocket());
}

//initializer
function init() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    
    calculate_initial_thrust(window.innerHeight);
    animate();
}

function calculate_initial_thrust(height) {
    bottom_limit = height * 0.9;
    top_limit    = height * 0.05;
}

//misc stuff
var gravity = 0;
var explode = 0.5;

var thrust   = -0.05; //thrust has to be negative, since the fireworks are moving UP
var friction = 0.025;

var bottom_limit, top_limit, flyable_height;
var f_lifetime = {
    max: 500,
    min: 250,
};
var init_v = {
    max: 0,
    min: 0,
};

var entities = [];

var background_colour = {r: 0, g: 0, b: 0}; //black
var firework_colours = [
    //from red to purple, plus white and silver
    {r: 255, g: 192, b: 203}, //pink
    {r: 220, g:  20, b:  60}, //crimson, or red
    {r: 255, g:  69, b:   0}, //redorange, or just orange
    {r: 255, g: 165, b:   0}, //brighter orange
    {r: 255, g: 255, b:   0}, //yellow
    {r: 255, g: 215, b:   0}, //gold
    {r: 124, g: 252, b:   0}, //lawngreen
    {r: 152, g: 251, b: 152}, //palegreen
    {r:   0, g: 206, b: 209}, //darkturquoise
    {r: 176, g: 224, b: 230}, //powderblue
    {r: 221, g: 160, b: 221}, //violet
    {r: 216, g: 191, b: 216}, //thistle
    {r: 255, g: 255, b: 255}, //white
    {r: 255, g: 248, b: 220}, //cornsilk
    {r: 220, g: 220, b: 220}, //gainsboro
    {r: 192, g: 192, b: 192}, //silver
];

function get_colour(colour, alpha) {
    if (alpha == undefined) {
        return "rgb(" + colour.r + ", " + colour.g + ", " + colour.b + ")";
    } else {
        return "rgba(" + colour.r + ", " + colour.g + ", " + colour.b + ", " + alpha + ")";
    }
}

//handling the firework while it's going up
//it will explode when it reaches a maximum height
function Firework_rocket() {
    this.x = random_number(0, width);
    this.y = window.innerHeight;
    this.r = 5;
    this.a = Math.PI / 2;
    
    this.active = true;
    
    this.max_height = random_number(bottom_limit, top_limit);
    
    this.colour = random_element(firework_colours);
    
    //tint the exhaust
    this.exhaust_colour = {
        r: Math.floor(this.colour.r / 5) + 200,
        g: Math.floor(this.colour.g / 5) + 200,
        b: Math.floor(this.colour.b / 5) + 200,
    };
    
    this.v = { x: 0, y: 0, };
    
    //functions of the firework rocket
    this.get_new_position = (lapse) => {
        if (this.y < this.max_height) {
            this.active = false;
            this.explode();
        } else {
            this.v.x += this.get_friction().x;
            this.v.y += this.get_friction().y;
            this.v.x += this.get_thrust().x;
            this.v.y += this.get_thrust().y;
            
            this.x += this.v.x * lapse;
            this.y += this.v.y * lapse;
        }
        
    };
    
    this.get_friction = () => {
        return {
            x: -this.v.x * friction,
            y: -this.v.y * friction,
        };
    };
    
    this.get_thrust = () => {
        return {
            x: 0,
            y: thrust,
        }
    };
    
    this.draw = (context) => {
        context.beginPath();
        context.fillStyle = get_colour(this.colour);
        context.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        context.fill();
        context.closePath();
    };
    
    this.explode = () => {
        
    };
}

function Rocket_exhaust_particle(x, y, a, colour) {
    this.x = x;
    this.y = y;
    this.a = Math.random() * (Math.PI / 9) + (a - Math.PI / 18);
    this.s = 0.1; //s here is for speed
    this.v = { x: Math.cos(this.a), y: Math.sin(this.a), };
    
    this.radius = random_number(1, 3);
    
    this.active = true;
    this.
    
    this.get_new_position = (lapse) => {
        
    };
}

//after the firework blows itself to pieces
function Fireworks_particle(x, y, a, colour) {
    this.x = x;
    this.y = y;
    this.a = a;
    
    this.colour = colour;
    
    this.max_lifetime = 1000;
    
    this.lifetime = 0;
    this.active   = false;
}