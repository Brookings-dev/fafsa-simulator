//helper function for grabbing colors for keys

//category name lookup
const keyLookup = {
	'More Conservative': '#F55D5B',
    'More Liberal': '#16659D',
    'Moderate': '#FDDB46' ,
    'Unknown' :  '#B3B3B3'
};

export default (key) => {
	return keyLookup[key] || key;
};