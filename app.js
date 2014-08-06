(function() {
var d, chart, now, names, watch,
	proxy, step;

start = new Date();
chart = {};
now = {
	month: [ start.getMonth() + 1, 12 ],
	week: [ start.getDay(), 6 ],
	day: [ start.getDate(), 31 ],
	hours: [ start.getHours(), 24 ],
	minutes: [ start.getMinutes(), 60 ],
	secs: [ start.getSeconds(), 60 ]
};

names = {};
names.month = [
	"", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
	"Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];
names.week = [
	"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"
];

watch = document.createElement( "div" );
watch.id = "watch";
document.body.appendChild( watch );

Object.keys( now ).forEach( function( item ) {
	chart[ item ] = createChart( item, now[ item ] );
});

function createChart( name, item ) {
	var value, max, elem;

	value = item[ 0 ],
	max = item[ 1 ];

	elem = document.createElement( "div" );
	elem.id = name;
	watch.appendChild( elem );

	return c3.generate({
		bindto: "#" + name,
		data: {
			columns: [
				[ name, value ]
			],
			type: "gauge"
		},
		size: {
			width: 200
		},
		gauge: {
			label: {
				format: function( value ) {
					return names[ name ] ?
						names[ name ][ value ] :
						value;
				}
			},
			min: 0,
			max: max,
			units: ''
		}
	});
}

var last = start;

function makeStep() {
	var d = new Date();

	console.log( ( d - last ) / 1000 );

	last = d;

	this.month = [ d.getMonth() + 1, 12 ];
	this.week = [ d.getDay(), 6 ];
	this.day = [ d.getDate(), 31 ];
	this.hours = [ d.getHours(), 24 ];
	this.minutes = [ d.getMinutes(), 60 ];
	this.secs = [ d.getSeconds(), 60 ];

	setTimeout( step, 1000 );
}

if ( window.Proxy ) {
	proxy = new Proxy( now, {
		set: function( obj, prop, value ) {
			value = value[ 0 ];

			if ( value !== obj[ prop ][ 0 ] ) {
				obj[ prop ][ 0 ] = value;
				chart[ prop ].load({
					columns: [[ prop, value ]]
				});
			}
		}
	});

	step = makeStep.bind( proxy );

} else if ( Object.observe ) {
	Object.observe( now, function( changes ) {
		changes.forEach(function( change ) {
			if ( change.type !== "update" ) {
				return;
			}

			var prop = change.name;
			var value = now[ prop ][ 0 ]

			if ( change.oldValue[ 0 ] !== value ) {
				chart[ prop ].load({
					columns: [[ prop, value ]]
				});
			}
		});
	});

	step = makeStep.bind( now );
}

step();

})();
