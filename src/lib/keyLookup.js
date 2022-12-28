//helper function for grabbing colors for keys

//category name lookup
const keyLookup = {
	'More Conservative': '#F55D5B',
    'More Liberal': '#16659D',
    'Moderate': '#FDDB46' ,
    'Unknown': '#B3B3B3',
    "Alternative Treatments/Prevention" : '#00649f',
    "Conspiracies" : '#8BC6FD',
    "Disease Severity" : '#2FA5B2',
    "Government Policy/Response" : '#FEDB31',
    "Testing" : '#C7A70A',
    "Vaccine Efficacy/Side Effects" : '#F25D00'
};

export default (key) => {
	return keyLookup[key] || key;
};
