import React from "react";
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
                tp.history.push("/" + channel)
            });
    }

    function toggleChannels() {
        if ($m(".my-channels").css("display") === "block") {
            $m(".my-channels").hide();
        } else {
            $m(".my-channels").show();
        }
    }

    const { channels } = tp.store.getState().data;

    return (
        <div className="my-channels" >
            <div className="title">My channels</div>
            {
                channels.length === 0
                    ?
                    <div className="loading2"><i className="icon-spin3 animate-spin"></i> Loading..</div>
                    :
                    channels.map((c, i) => {

                        return (
                            <div key={i} className={tp.context === c.name ? "item selected" : "item"} onClick={() => handleClick(c.name)}>
                                {c.name + "(" + c.count + ")"}
                            </div>
                        )
                    })
            }
        </div >
    )

}

export default MyChannels

