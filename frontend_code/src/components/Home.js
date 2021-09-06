import React, { useState, useEffect } from "react";
import { Tabs, message, Row, Col, Button } from "antd";
import axios from "axios";

import SearchBar from "./SearchBar";
import PhotoGallery from "./PhotoGallery";
import CreatePostButton from "./CreatePostButton";
import { SEARCH_KEY, BASE_URL, TOKEN_KEY, GEO_OPTIONS, POS_KEY } from "../constants";
import AroundMap from './AroundMap';

const { TabPane } = Tabs;

function Home(props) {
    const [posts, setPost] = useState([]);
    const [activeTab, setActiveTab] = useState("image");
    const [searchOption, setSearchOption] = useState({
        type: SEARCH_KEY.all,
        keyword: ""
    });
    const [radius, setRadius] = useState(0);
    const [center, setCenter] = useState([]);
    const [mapChange, setMapChange] = useState(false);
    const [isLoadingGeoLocation, setIsLoadingGeoLocation] = useState(false);
    const [error, setError] = useState('');
    let componentMounted = true;

    const handleSearch = (option) => {
        const { type, keyword } = option;
        setSearchOption({ type: type, keyword: keyword });
    };

    useEffect(() => {
        const { type, keyword } = searchOption;
        fetchPost(searchOption);
    }, [searchOption]);

    useEffect(() => {
        fetchPost(searchOption);
    }, [mapChange]);

    useEffect(() => {
        if (componentMounted && "geolocation" in navigator) {
            setIsLoadingGeoLocation(true)
            setError('')
            navigator.geolocation.getCurrentPosition(
                onSuccessLoadGeoLocation,
                onFailedLoadGeoLocation,
                GEO_OPTIONS,
            );
        } else {
            setError('Geolocation is not supported.')
        }
        return () => { // This code runs when component is unmounted
            componentMounted = false; // (4) set it to false if we leave the page
        }
    }, []);

    const onSuccessLoadGeoLocation = (position) => {
        console.log(position);
        const {latitude, longitude} = position.coords;
        localStorage.setItem(POS_KEY, JSON.stringify({lat: latitude, lon: longitude}));
        setIsLoadingGeoLocation(false)
        setError('')
    };

    const onFailedLoadGeoLocation = () => {
        setIsLoadingGeoLocation(false)
        setError('Failed to load geo location.')
    };

    const fetchPost = (option) => {
        const { type, keyword } = option;
        let url = "";

        if (type === SEARCH_KEY.all) {
            url = `${BASE_URL}/search`;
        } else if (type === SEARCH_KEY.user) {
            url = `${BASE_URL}/search?user=${keyword}`;
        } else if (type === SEARCH_KEY.map) {
            console.log("search on map");
            const { lat, lon } = center ? center : JSON.parse(localStorage.getItem(POS_KEY));
            const range = radius != 0 ? radius : 20;
            url = `${BASE_URL}/search?map=1&lat=${lat}&lon=${lon}&range=${range}`;
        } else {
            url = `${BASE_URL}/search?keywords=${keyword}`;
        }

        setIsLoadingGeoLocation(true)
        setError('')

        const opt = {
            method: "GET",
            url: url,
            headers: {
                Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`
            }
        };

        axios(opt)
            .then((res) => {
                if (res.status === 200) {
                    console.log(res.data)
                    setPost(res.data ? res.data: []);
                }
            })
            .catch((err) => {
                message.error("Fetch posts failed!");
                console.log("fetch posts failed: ", err.message);
            });
    };

    const renderPosts = (type) => {
        if (!posts || posts.length === 0) {
            return <div>No data!</div>;
        }
        if (type === "image") {
            if (searchOption.type === SEARCH_KEY.map) {
                const imageArr = posts
                    .filter((item) => item.type === "image")
                    .map((image) => {
                        return {
                            type: image.type,
                            postId: image.id,
                            location: image.location,
                            src: image.url,
                            user: image.user,
                            caption: image.message,
                            thumbnail: image.url,
                            thumbnailWidth: 300,
                            thumbnailHeight: 200
                        };
                    });
                return (
                <AroundMap
                    googleMapURL=""
                    loadingElement={<div style={{ height: `100%` }} />}
                    containerElement={<div style={{ height: `600px` }} />}
                    mapElement={<div style={{ height: `100%` }} />}
                    items={imageArr}
                    onShowNewMap={showNewMap}
                />)
            }
            else {
                const imageArr = posts
                    .filter((item) => item.type === "image")
                    .map((image) => {
                        return {
                            type: image.type,
                            postId: image.id,
                            location: image.location,
                            src: image.url,
                            user: image.user,
                            caption: image.message,
                            thumbnail: image.url,
                            thumbnailWidth: 300,
                            thumbnailHeight: 200
                        };
                    });
                return <PhotoGallery images={imageArr}/>
            }
        } else if (type === "face") {
            if (searchOption.type === SEARCH_KEY.map) {
                const imageArr = posts
                    .filter((item) => item.type === "image" && item.face >= 0.8)
                    .map((image) => {
                        return {
                            type: image.type,
                            postId: image.id,
                            location: image.location,
                            src: image.url,
                            user: image.user,
                            caption: image.message,
                            thumbnail: image.url,
                            thumbnailWidth: 300,
                            thumbnailHeight: 200
                        };
                    });
                return (
                    <AroundMap
                        googleMapURL=""
                        loadingElement={<div style={{ height: `100%` }} />}
                        containerElement={<div style={{ height: `600px` }} />}
                        mapElement={<div style={{ height: `100%` }} />}
                        items={imageArr}
                        onShowNewMap={showNewMap}
                    />)
            }
            else {
                const imageArr = posts
                    .filter((item) => item.type === "image" && item.face >= 0.8)
                    .map((image) => {
                        return {
                            type: image.type,
                            postId: image.id,
                            location: image.location,
                            src: image.url,
                            user: image.user,
                            caption: image.message,
                            thumbnail: image.url,
                            thumbnailWidth: 300,
                            thumbnailHeight: 200
                        };
                    });
                return <PhotoGallery images={imageArr}/>
            }
        } else if (type === "video") {
            if (searchOption.type === SEARCH_KEY.map) {
                const videoArr = posts
                    .filter((item) => item.type === "video")
                    .map((image) => {
                        return {
                            type: image.type,
                            postId: image.id,
                            location: image.location,
                            src: image.url,
                            user: image.user,
                            caption: image.message,
                            thumbnail: image.url,
                            thumbnailWidth: 300,
                            thumbnailHeight: 200
                        };
                    });
                return (
                    <AroundMap
                        googleMapURL=""
                        loadingElement={<div style={{ height: `100%` }} />}
                        containerElement={<div style={{ height: `600px` }} />}
                        mapElement={<div style={{ height: `100%` }} />}
                        items={videoArr}
                        onShowNewMap={showNewMap}
                    />)
            }
            return (
                <Row gutter={32}>
                    {posts
                        .filter((post) => post.type === "video")
                        .map((post) => (
                            <Col span={8} key={post.url}>
                                <video src={post.url} controls={true} className="video-block" />
                                <p>
                                    {post.user}: {post.message}
                                </p>
                            </Col>
                        ))}
                </Row>
            );
        }
    };

    const showNewMap = (center, radius) => {
        setCenter(center)
        setRadius(radius)
        setMapChange(!mapChange)
    };

    const showPost = (type) => {
        console.log("type -> ", type);
        setActiveTab(type); //change tab will render

        setTimeout(() => {
            setSearchOption({ type: SEARCH_KEY.all, keyword: "" });
        }, 3000);
    };

    const operations = <CreatePostButton onShowPost={showPost} />;
    return (
        <div className="home">
            <SearchBar handleSearch={handleSearch} />
            <div className="display">
                <Tabs
                    onChange={(key) => setActiveTab(key)}
                    defaultActiveKey="image"
                    activeKey={activeTab}
                    tabBarExtraContent={operations}
                >
                    <TabPane tab="Images" key="image">
                        {renderPosts("image")}
                    </TabPane>
                    <TabPane tab="Faces" key="face">
                        {renderPosts("face")}
                    </TabPane>
                    <TabPane tab="Videos" key="video">
                        {renderPosts("video")}
                    </TabPane>
                </Tabs>
            </div>
        </div>
    );
}

export default Home;
