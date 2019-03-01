
/*
    common definitions for VAST.js
*/

//
// utilities
//

// define log if not defined
if (typeof global.LOG === 'undefined') {
	var logger  = require('./common/logger');
	global.LOG  = new logger();

	// set default error level
	LOG.setLevel(3);
}


//
// VAST & VON
//
global.UTIL			= require('./common/util');

global.VAST         = require('./types');
global.VAST.net     = require('./net/vast_net');
global.VAST.client  = require('./client');
global.VAST.matcher = require('./matcher');

// ID definitions
global.VAST.ID_UNASSIGNED = 0;
global.VAST.ID_GATEWAY    = 1;
global.NET_ID_UNASSIGNED  = 0;

// TODO: find a better way to store this? (maybe in msg_handler?)
global.VAST.state = {
    ABSENT:         0,
    INIT:           1,           // init done
    JOINING:        2,           // different stages of join
    JOINED:         3
};

global.VSO = {
	CANDIDATE: 	1,      // a idle matcher
    PROMOTING: 	2,      // in the process of promotion
    ACTIVE: 	3,      // active regular matcher
    ORIGIN:		4      // active origin matcher
};


global.VAST.priority = {
    HIGHEST:        0,
    HIGH:           1,
    NORMAL:         2,
    LOW:            3,
    LOWEST:         4
};

// TODO: combine into nicer-looking global
global.VAST.msgtype = {
    BYE:        		0,  // disconnect
    PUB:        		1,  // publish request
    SUB:        		2,  // subscribe request
	JOIN:				3,	// join request
	MATCHER_CANDIDATE:	4,	// possible candidate matcher
	MATCHER_INIT:		5,	// initialise matcher
	MATCHER_ALIVE: 		6,	// keepalive message from matcher to gateway
	MATCHER_WORLD_INFO: 7,	// learn world_id and origin matcher address
	NOTIFY_MATCHER: 	8,	// current matcher notifying client of new current matcher
	NOTIFY_CLOSEST:		9, 	// current matcher notifying client of closest alternative matcher
	LEAVE:				10, // departure of a client
	SUB_R:				11,	// to reply whether a node has successfully subscribed (VON node joined)
	SUB_TRANSFER:		12,	// transfer a subscription to a neighbor matcher
	SUB_UPDATE:			13,	// update of a subscription to neighboring matchers
	MOVE:				14,	// position update to normal nodes
	MOVE_F:				15,	// full update for an AOI region
	NEIGHBOR:			16,	// send back a list of known neighbors
	NEIGHBOR_REQUEST:	17,	// request full info for an unknown neighbor
	SEND:				18,	// send a particular message to certain targets
	ORIGIN_MESSAGE:		19,	// messsage to origin matcher
	MESSAGE:			20,	// deliver a message to a node
	SUB_NOTIFY:			21,	// client notifying a relay of its subscription
	STAT:				22,	// sending statistics for gateway to record
	SYNC_CLOCK:			23	// synchronize logical clock with gateway
};

global.VAST.msgstr = [
    'BYE',
    'PUB',
    'SUB',
	'JOIN',
	'MATCHER_CANDIDATE',
	'MATCHER_INIT',
	'MATCHER_ALIVE',
	'MATCHER_WORLD_INFO',
	'NOTIFY_MATCHER',
	'NOTIFY_CLOSEST',
	'LEAVE',
	'SUB_R',
	'SUB_TRANSFER',
	'SUB_UPDATE',
	'MOVE',
	'MOVE_F',
	'NEIGHBOR',
	'NEIGHBOR_REQUEST',
	'SEND',
	'ORIGIN_MESSAGE',
	'MESSAGE',
	'SUB_NOTIFY',
	'STAT',
	'SYNC_CLOCK'
];

global.VON          = {
    peer: require('./VON_peer')
};

// configurable settings
global.VAST.Settings = {
	port_gateway:	37700,
	IP_gateway:		'127.0.0.1'
};