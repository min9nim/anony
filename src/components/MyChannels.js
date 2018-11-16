import React from "react";
//import { Link } from "react-router-dom";
import $m from "../../com/util";


import "./MyChannels.scss";

const MyChannels = (props) => {

    function handleClick(channel) {
        tp.context = channel;
        tp.api.getPosts({ idx: 0, cnt: 10, context: channel })
            .then(tp.checkStatus)
            .then(res => tp.store.dispatch(tp.action.setPosts(res.posts)))
            .then(() => { tp.isScrollLast = false; })
            .then(toggleChannels)
            .then(() => {
                props.history.push("/" + channel)
            });
    }

    function toggleChannels() {
        if ($m(".my-channels").css("display") === "block") {
            $m(".my-channels").hide();
        } else {
            $m(".my-channels").show();
        }
    }

    return (
        <div className="channels-wrappter">
            <div className="my-channels" >
                <div className="title">My channels</div>
                {
                    props.channels.length === 0
                        ?
                        <div className="loading2"><i className="icon-spin3 animate-spin"></i> Loading..</div>
                        :
                        props.channels.map((c, i) => {

                            return (
                                <div key={i} className={tp.context === c ? "item selected" : "item"} onClick={() => handleClick(c)}>
                                    {c}
                                </div>
                            )
                        })
                }
            </div >
            <i className="icon-list channel-btn" onClick={toggleChannels} />
        </div>
    )

}

export default MyChannels

