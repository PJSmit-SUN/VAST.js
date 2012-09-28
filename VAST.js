
/*
 * VAST, a scalable peer-to-peer network for virtual environments
 * Copyright (C) 2005-2011 Shun-Yun Hu (syhu@ieee.org)
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
 *
 */

/*
    The basic interface for all major VAST functions.
    supporting spatial publish subscribe (SPS) 

    supported functions:
    
    // basic callback / structure
    settings = {port};
    pos  = {x, y}
    addr = {host, port}
    area = {pos, radius}
    msg  = {from_id, size, type, data, is_reliable}  // message sent & received by clients
    sub  = {sub_id, subscriber, layer, aoi, relay}   // subscription info
    
    sub_CB(result, subID)               // callback to receive subscribe result
    neighbor_CB(list)                   // callback to receive neighbor (node) list
    recv_CB(msg)                        // callback to receive any messages
    
    // constructor
    VAST(recv_CB, settings)
    
    // basic functions
    join(GW_addr, world_id)             join the VAST network given a gateway and world 
    leave()                             leave the VAST network
    subscribe(layer, area, sub_CB)      subscribe for an area at a given layer
    publish(layer, area, msg)           publish a message to an area at a given layer
    move(subID, area)                   move a subscription to a new position
    send(id, msg)                       send a message to specified user(s)
    list(area, neighbor_CB)             get a list of subscribers within an area
   
    // stat / accessors 
    getPhysicalNeighbors()              get a list of physical neighbors currently known
    getLogicalNeighbors()               get a list of logical neighbors currently known
    reportGateway(msg)                  send some custom message to gateway (for stat / record keeping)
    reportOrigin(msg)                   send some custom message to origin matcher (for stat / record keeping)
    getStat()                           get stat stored locally
    getSelf()                           get info on self node
    getSubID()                          get my current subscription ID (?)
    getWorldID()                        get my world ID
    getLatency(msgtype)                 get latency stat for a particular message type
    
    // state report
    isJoined()                          check if I'm joined
    isRelay()                           check if I'm a Relay node
    isPublic()                          check if I have public address (IP) so may serve
     
    history:
        2012-07-06              initial version (convert interface from VAST.h)
        2012-09-10              begin implementation
*/

require('./common.js');

// config
var TIMEOUT_JOIN          = (5);        // # of seconds before re-attempting to join 
//var TIMEOUT_SUBSCRIBE     = (5);        // # of seconds before re-attempting to subscribe 
//var TIMEOUT_REMOVE_GHOST  = (5);        // # of seconds before removing ghost objects at clients

// TODO: combine with VON_peer?
var NodeState = {
    ABSENT:         0,
    QUERYING:       1,           // finding / determing certain thing
    JOINING:        2            // different stages of join
};

function VAST(recv_callback, settings) {

    // set default values
    var _gatewayDefault = "127.0.0.1:37700";
    var _worldDefault = 1;

    // callback to notify subscribed messages received
    var _recv_CB = recv_callback;

    // info about the gateway server
    var _gateway = undefined;
    
    // my current worldID
    var _world_id = undefined;
    
    // state of joining
    var _state = NodeState.ABSENT;
    
    
/*
        // variables used by VASTClient component
        Node                _self;          // information regarding current node

        vector<Node *>      _neighbors;     // list of current AOI neighbors
        vector<Node *>      _physicals;     // list of physical neighbors
        vector<Node *>      _logicals;      // list of logical neighbors
        
        id_t                _matcher_id;    // hostID for interest matcher
        id_t                _closest_id;    // hostID for the closest neighbor matcher
        VASTRelay          *_relay;         // pointer to VASTRelay (to obtain relayID)        

        Subscription        _sub;           // my subscription 

        // timeouts
        timestamp_t         _next_periodic;     // next timestamp to perform tasks
        timestamp_t         _timeout_subscribe; // timeout for re-attempt to subscribe        
        map<id_t, timestamp_t> _last_update;    // last update time for a particular neighbor

        
        // storage for incoming messages        
        vector<Message *>   _msglist;   // record for incoming messages
        VASTBuffer          _recv_buf;  // a receive buffer for incoming messages
        Message *           _lastmsg;   // last message received from network (to be deleted)
                                        // TODO: a better way for it?
       
        // stats
        map<msgtype_t, StatType>  _latency; // latencies for different message types 
*/    
     
    //
    // public methods
    //
    
    // join the VAST network given a gateway and world 
    // NOTE: join is callable at any stage (can join or re-join any time)
    this.join = function (GW_addr, world_id) {

        // check if already joined (if so, then need to leave first before re-join)
        if (_state === NodeState.JOINED) {
            LOG.warn('join(): already joined');
            return false;
        }
        
        // get gateway, if available, or use default
        _gateway = _gateway || GW_addr || _gatewayDefault;
 
        // ensure gateway's type is correct
        var addr = new VAST.addr();
        addr.parse(_gateway);
        _gateway = addr;
            
        // TODO: validate gateway address
        // TODO: convert possible "127.0.0.1" to actual IP address
        //_net->validateIPAddress(gateway);
        //_gateway = Addr (net_manager::resolveHostID (&gateway), &gateway);

        LOG.debug('joining VAST Gateway: ' + _gateway.toString());
        
        // record my worldID, so re-join attempts can proceed with correct worldID
        _world_id = world_id || _world_id || _worldDefault;
                
        // set timeout to re-try, necessary because it might take time for sending request
        setTimeout(join, TIMEOUT_JOIN * 1000);

        _state = NodeState.JOINING;
        
        /*
        // if relay is yet known, wait first
        if (_relay->isJoined() == false)
            return false;
        */
        
        // send out join request
        var pack = new VAST.pack(
            VAST_MESSAGE.JOIN, 
            _world.id,
            VON_Priority.HIGHEST);
                  
        //Message msg (JOIN);
        //msg.store (_world_id);

        return sendGatewayMessage(pack, MSG_GROUP_VAST_MATCHER);
    }
    
    // leave the VAST network
    this.leave = function () {  
    }

    // subscribe for an area at a given layer
    this.subscribe = function (layer, area, sub_CB) {
    }
    
    // publish a message to an area at a given layer
    this.publish = function (layer, area, msg) {
    
    }
    
    // move a subscription to a new position
    this.move = function (subID, area) {
    }

    // send a message to specified user(s)
    this.send = function (id, msg) {
    }

    // get a list of subscribers within an area
    this.list = function (area, neighbor_CB) {
    } 
}

// export the class with conditional check
if (typeof module !== "undefined")
	module.exports = VAST;
