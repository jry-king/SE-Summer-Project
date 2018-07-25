import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Button } from 'antd'
import { shallow, mount, render } from 'enzyme';

import Map from './Utils/Map'
import Camera from './Utils/Camera'
import VideoCrop from './Utils/VideoCrop'
import Header from './Utils/Header'
import MapManagement from './Management/MapManagement'
import MapRow from './Management/MapRow'
import { dataApi, videoServer, hlsServer } from './Global'
import LiveVideo from './LiveVideo/LiveVideo'
import HistoryVideo from './HistoryVideo/HistoryVideo'
import CameraRow from './Management/CameraRow';

describe('Test <App/>', () => {
    it('renders without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(<App />, div);
        ReactDOM.unmountComponentAtNode(div);
    });
})

const cameras = [
    {
        "cameraid": 1,
        "param1": "param1",
        "param2": "param2",
        "param3": "param3",
        "x": "20%",
        "y": "10%",
        "areaid": 1
    },
    {
        "cameraid": 2,
        "param1": "param1",
        "param2": "param2",
        "param3": "param3",
        "x": "30%",
        "y": "40%",
        "areaid": 1
    }
]

describe('Test <Map/>', () => {
    test('<Map/> should renders correct number of <Camera/>',() => {
        const wrapper = shallow(<Map cameras={cameras} />)
        expect(wrapper.find(Camera)).toHaveLength(2);
    });
});

describe('Test <VideoCrop/>', () => {
    test('<VideoCrop/> should play correct video src',() => {
        let src = videoServer + 'test.webm'
        let type = "video/webm"
        const wrapper = shallow(<VideoCrop videoUrl={src} videoType={type}/>)
        expect(wrapper.find({src: src, type: type})).toHaveLength(1)
    })

    test('<VideoCrop/> should only display one button at first',() => {
        let src = videoServer + 'test.webm'
        let type = "video/webm"
        const wrapper = shallow(<VideoCrop videoUrl={src} videoType={type}/>)
        expect(wrapper.find({type:'primary'})).toHaveLength(1)
    })
})

describe('Test <Header/>', () => {
    test('<Header/> should render exactly as expected', () => {
        let test = 'test'
        const wrapper = shallow(<Header title={test} />)
        expect(wrapper.equals(
            <div>
            <h2 className = "title">GETS | 慧眼示踪搜寻系统</h2>
            <h3 className = "subtitle">God Eye Tracking System </h3>
            <h1 className="App-title">{test}</h1>
            </div>
        )).toBe(true)
    })
})

describe('Test <MapRow/>', () => {
    test('<MapRow/> should render exactly as expected', () => {
        const map = {
            "mapid": 6,
            "areaid": 1,
            "map": "https://cdn-images-1.medium.com/max/1600/1*P4Z6NIm0dHypW2NnXqinqg.jpeg"
        }   
        const wrapper = shallow(<MapRow map={map}/>)
        const mapid = map.mapid
        const mapimg = map.map
        const areaid = map.areaid
        expect(wrapper.contains(
            <td>{mapid}</td>
        )).toBe(true)
        expect(wrapper.contains(
            <td><img src={mapimg} alt={"map"+areaid} width={100} height={100}/></td>
        )).toBe(true)
        expect(wrapper.contains(
            <td>{areaid}</td>
        )).toBe(true)
        expect(wrapper.find(Button)).toHaveLength(2)
    })
})

describe('Test <CameraRow/>', () => {
    test('<CameraRow/> should render exactly as expected', () => {
        const camera = {
            "cameraid": 1,
            "param1": "param1",
            "param2": "param2",
            "param3": "param33",
            "x": "20%",
            "y": "10%",
            "areaid": 1
        }
        const wrapper = shallow(<CameraRow camera={camera}/>)
        expect(wrapper.contains(
            <td>{camera.cameraid}</td>
        )).toBe(true)
        expect(wrapper.contains(
            <td>{camera.param1}</td>
        )).toBe(true)
        expect(wrapper.contains(
            <td>{camera.param2}</td>
        )).toBe(true)
        expect(wrapper.contains(
            <td>{camera.param3}</td>
        )).toBe(true)
        expect(wrapper.contains(
            <td>{camera.x}</td>
        )).toBe(true)
        expect(wrapper.contains(
            <td>{camera.y}</td>
        )).toBe(true)
        expect(wrapper.contains(
            <td>{camera.areaid}</td>
        )).toBe(true)
        expect(wrapper.find(Button)).toHaveLength(2)
    })
})

function flushPromises() {
    return new Promise(resolve => setImmediate(resolve));
}

describe('Test <MapManagement/>', () => {
    test('After mounted, fetch should be called only once', () => {
        fetch
            .once(JSON.stringify([
            {
                "mapid": 7,
                "areaid": 0,
                "map": "https://cdn-images-1.medium.com/max/1600/1*P4Z6NIm0dHypW2NnXqinqg.jpeg"
            },
            {
                "mapid": 6,
                "areaid": 1,
                "map": "https://cdn-images-1.medium.com/max/1600/1*P4Z6NIm0dHypW2NnXqinqg.jpeg"
            }
        ]))
        const wrapper = mount(<MapManagement/>)
        return flushPromises().then(() => {
            expect(wrapper.state().maps).toHaveLength(2)
            expect(fetch.mock.calls).toHaveLength(1);
        });
    })
    test('<MapManagement/> should render correct number of map', () => {
        fetch
            .once(JSON.stringify([
            {
                "mapid": 7,
                "areaid": 0,
                "map": "https://cdn-images-1.medium.com/max/1600/1*P4Z6NIm0dHypW2NnXqinqg.jpeg"
            },
            {
                "mapid": 6,
                "areaid": 1,
                "map": "https://cdn-images-1.medium.com/max/1600/1*P4Z6NIm0dHypW2NnXqinqg.jpeg"
            }
        ]))
        const wrapper = mount(<MapManagement/>)
        return flushPromises().then(() => {
            wrapper.update()
            expect(wrapper.state().maps.length).toEqual(wrapper.find(MapRow).length)
        });
    })
})

describe('Test <LiveVideo/>', () => {
    test('After mounted, fetch should be called twice', () => {
        fetch.resetMocks()
        fetch
            .once(JSON.stringify({
                "mapid": 6,
                "areaid": 1,
                "map": "https://cdn-images-1.medium.com/max/1600/1*P4Z6NIm0dHypW2NnXqinqg.jpeg"
            }))
            .once(JSON.stringify([
                {
                    "cameraid": 1,
                    "param1": "param1",
                    "param2": "param2",
                    "param3": "param3",
                    "x": "20%",
                    "y": "10%",
                    "areaid": 1
                },
                {
                    "cameraid": 2,
                    "param1": "param1",
                    "param2": "param2",
                    "param3": "param3",
                    "x": "30%",
                    "y": "40%",
                    "areaid": 1
                }
            ]))
        const match = { params: { camera: null } }
        const wrapper = mount(<LiveVideo match={match}/>)
        return flushPromises().then(() => {
            expect(wrapper.state().cameras).toHaveLength(2)
            expect(fetch.mock.calls).toHaveLength(2);
        });
    })
    test('<LiveVideo/> should not render <VideoCrop/> when props.match.params.camera is null', () => {
        fetch
            .once(JSON.stringify({
                "mapid": 6,
                "areaid": 1,
                "map": "https://cdn-images-1.medium.com/max/1600/1*P4Z6NIm0dHypW2NnXqinqg.jpeg"
            }))
            .once(JSON.stringify([
                {
                    "cameraid": 1,
                    "param1": "param1",
                    "param2": "param2",
                    "param3": "param3",
                    "x": "20%",
                    "y": "10%",
                    "areaid": 1
                },
                {
                    "cameraid": 2,
                    "param1": "param1",
                    "param2": "param2",
                    "param3": "param3",
                    "x": "30%",
                    "y": "40%",
                    "areaid": 1
                }
            ]))
        const match = { params: { camera: null } }
        const wrapper = shallow(<LiveVideo match={match}/>)
        expect(wrapper.find(VideoCrop)).toHaveLength(0)
    })
    test('<LiveVideo/> should render <VideoCrop/> when props.match.params.camera is not null', () => {
        fetch
            .once(JSON.stringify({
                "mapid": 6,
                "areaid": 1,
                "map": "https://cdn-images-1.medium.com/max/1600/1*P4Z6NIm0dHypW2NnXqinqg.jpeg"
            }))
            .once(JSON.stringify([
                {
                    "cameraid": 1,
                    "param1": "param1",
                    "param2": "param2",
                    "param3": "param3",
                    "x": "20%",
                    "y": "10%",
                    "areaid": 1
                },
                {
                    "cameraid": 2,
                    "param1": "param1",
                    "param2": "param2",
                    "param3": "param3",
                    "x": "30%",
                    "y": "40%",
                    "areaid": 1
                }
            ]))
        const match = { params: { camera: 'camera1' } }
        const wrapper = shallow(<LiveVideo match={match}/>)
        expect(wrapper.find(VideoCrop)).toHaveLength(1)
    })
    test('<LiveVideo/> should pass correct video source to the <VideoCrop/>', () => {
        fetch
        .once(JSON.stringify({
            "mapid": 6,
            "areaid": 1,
            "map": "https://cdn-images-1.medium.com/max/1600/1*P4Z6NIm0dHypW2NnXqinqg.jpeg"
        }))
        .once(JSON.stringify([
            {
                "cameraid": 1,
                "param1": "param1",
                "param2": "param2",
                "param3": "param3",
                "x": "20%",
                "y": "10%",
                "areaid": 1
            },
            {
                "cameraid": 2,
                "param1": "param1",
                "param2": "param2",
                "param3": "param3",
                "x": "30%",
                "y": "40%",
                "areaid": 1
            }
        ])) 
        const match = { params: { camera: 'camera2' } }
        const wrapper = shallow(<LiveVideo match={match}/>)
        expect(wrapper.find({videoUrl: hlsServer + 'camera2.m3u8'}))
    })
})

describe('Test <HistoryVideo/>', () => {
    test('After mounted, fetch should be called twice', () => {
        fetch.resetMocks()
        fetch
            .once(JSON.stringify({
                "mapid": 6,
                "areaid": 1,
                "map": "https://cdn-images-1.medium.com/max/1600/1*P4Z6NIm0dHypW2NnXqinqg.jpeg"
            }))
            .once(JSON.stringify([
                {
                    "cameraid": 1,
                    "param1": "param1",
                    "param2": "param2",
                    "param3": "param3",
                    "x": "20%",
                    "y": "10%",
                    "areaid": 1
                },
                {
                    "cameraid": 2,
                    "param1": "param1",
                    "param2": "param2",
                    "param3": "param3",
                    "x": "30%",
                    "y": "40%",
                    "areaid": 1
                }
            ]))
        const match = { params: { camera: null } }
        const wrapper = mount(<LiveVideo match={match}/>)
        return flushPromises().then(() => {
            expect(wrapper.state().cameras).toHaveLength(2)
            expect(fetch.mock.calls).toHaveLength(2);
        });
    })
    test('<HistoryVideo/> should not render <VideoCrop/> when props.match.params.file is null',() => {
        fetch
        .once(JSON.stringify({
            "mapid": 6,
            "areaid": 1,
            "map": "https://cdn-images-1.medium.com/max/1600/1*P4Z6NIm0dHypW2NnXqinqg.jpeg"
        }))
        .once(JSON.stringify([
            {
                "cameraid": 1,
                "param1": "param1",
                "param2": "param2",
                "param3": "param3",
                "x": "20%",
                "y": "10%",
                "areaid": 1
            },
            {
                "cameraid": 2,
                "param1": "param1",
                "param2": "param2",
                "param3": "param3",
                "x": "30%",
                "y": "40%",
                "areaid": 1
            }
        ]))
        .once(JSON.stringify([
            {
                "historyid": 1,
                "cameraid": 1,
                "areaid": 1,
                "filename": "test"
            },
            {
                "historyid": 2,
                "cameraid": 1,
                "areaid": 1,
                "filename": "test2"
            },
            {
                "historyid": 3,
                "cameraid": 2,
                "areaid": 1,
                "filename": "test3"
            }
        ]))
        const match = { params: { file: null } }
        const wrapper = shallow(<HistoryVideo match={match}/>)
        expect(wrapper.find(VideoCrop)).toHaveLength(0)
    })
    test('<HistoryVideo/> should render <VideoCrop/> when props.match.params.file is not null', () => {
        fetch
        .once(JSON.stringify({
            "mapid": 6,
            "areaid": 1,
            "map": "https://cdn-images-1.medium.com/max/1600/1*P4Z6NIm0dHypW2NnXqinqg.jpeg"
        }))
        .once(JSON.stringify([
            {
                "cameraid": 1,
                "param1": "param1",
                "param2": "param2",
                "param3": "param3",
                "x": "20%",
                "y": "10%",
                "areaid": 1
            },
            {
                "cameraid": 2,
                "param1": "param1",
                "param2": "param2",
                "param3": "param3",
                "x": "30%",
                "y": "40%",
                "areaid": 1
            }
        ]))
        .once(JSON.stringify([
            {
                "historyid": 1,
                "cameraid": 1,
                "areaid": 1,
                "filename": "test"
            },
            {
                "historyid": 2,
                "cameraid": 1,
                "areaid": 1,
                "filename": "test2"
            },
            {
                "historyid": 3,
                "cameraid": 2,
                "areaid": 1,
                "filename": "test3"
            }
        ]))
        const test = 'test'
        const match = { params: { file: test } }
        const wrapper = shallow(<HistoryVideo match={match}/>)
        expect(wrapper.find(VideoCrop)).toHaveLength(1)
    })
    test('<HistoryVideo/> should pass correct video source to the <VideoCrop/>', () => {
        fetch
        .once(JSON.stringify({
            "mapid": 6,
            "areaid": 1,
            "map": "https://cdn-images-1.medium.com/max/1600/1*P4Z6NIm0dHypW2NnXqinqg.jpeg"
        }))
        .once(JSON.stringify([
            {
                "cameraid": 1,
                "param1": "param1",
                "param2": "param2",
                "param3": "param3",
                "x": "20%",
                "y": "10%",
                "areaid": 1
            },
            {
                "cameraid": 2,
                "param1": "param1",
                "param2": "param2",
                "param3": "param3",
                "x": "30%",
                "y": "40%",
                "areaid": 1
            }
        ]))
        .once(JSON.stringify([
            {
                "historyid": 1,
                "cameraid": 1,
                "areaid": 1,
                "filename": "test"
            },
            {
                "historyid": 2,
                "cameraid": 1,
                "areaid": 1,
                "filename": "test2"
            },
            {
                "historyid": 3,
                "cameraid": 2,
                "areaid": 1,
                "filename": "test3"
            }
        ]))
        const test = 'test'
        const match = { params: { file: test } }
        const wrapper = shallow(<LiveVideo match={match}/>)
        expect(wrapper.find({videoUrl: videoServer + test + '.webm'}))
    })
})

/*
describe('Test Api', () => {
    test('Test /api/camera?areaid=1', () => {
        return fetch(dataApi + 'camera?areaid=1',{
                methdo: 'get'
            })
            .then(res => res.json())
            .then(
                (result) => {
                    expect(result.status).toBeUndefined()
                    expect(result).toBeInstanceOf(Object)
            });
    });

    test('Test /api/history?areaid=1', () => {
        return fetch(dataApi + 'history?areaid=1',{
                methdo: 'get'
            })
            .then(res => res.json())
            .then(
                (result) => {
                    expect(result.status).toBeUndefined()
                    expect(result).toBeInstanceOf(Object)
            });
    });

    test('Test /api/map?areaid=1', () => {
        return fetch(dataApi + 'map?areaid=1',{
                methdo: 'get'
            })
            .then(res => res.json())
            .then(
                (result) => {
                    expect(result.status).toBeUndefined()
                    expect(result).toBeInstanceOf(Object)
            });
    });

    const testid = -2
    const jsonData = {
        "cameraid": testid,
        "param1": "param1",
        "param2": "param2",
        "param3": "param3",
        "x": "40%",
        "y": "50%",
        "areaid": testid
    }
    test('Test /api/camera/save\n\t- save a camera ( cameraid = '+testid+', areaid = '+testid+')', () => {
        return fetch(dataApi + 'camera/save',{
                method:'post',
                credentials:'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(jsonData)
            })
            .then(res => res.json())
            .then(
                (result) => {
                    expect(result.status).toBeUndefined()
                    expect(result).toBeInstanceOf(Object)
                    expect(result).toEqual(jsonData)
            });
    });

    test('Test /api/camera?areaid=' + testid + '\n\t- fetch the camera data ( cameraid = '+testid+', areaid = '+testid+')', () => {
        return fetch(dataApi + 'camera?areaid=' + testid,{
                methdo: 'get'
            })
            .then(res => res.json())
            .then(
                (result) => {
                    expect(result.status).toBeUndefined()
                    expect(result).toBeInstanceOf(Object)
                    expect(result[0]).toEqual(jsonData)
            });
    });

    test('Test /api/camera/delete?cameraid=' + testid + '\n\t- delete the camera ( cameraid = '+testid+', areaid = '+testid+')', () => {
        let formData = "cameraid="+encodeURIComponent(testid)

        return fetch(dataApi + 'camera/delete?cameraid=' + testid,{
                method:'delete',
                credentials:'include',
            })
            .then(
                (result) => {
                    expect(result.ok).toBe(true)
            });
    });

    let path = 'camera?areaid='+testid
    test('Test /api/camera?areaid=' + testid + '\n\t- fetch the camera data ( cameraid = '+testid+', areaid = '+testid+')', () => {
        return fetch(dataApi + 'camera?areaid=' + testid,{
                methdo: 'get'
            })
            .then(res => res.json())
            .then(
                (result) => {
                    expect(result.status).toBeUndefined()
                    expect(result).toEqual([])
            });
    });
})
*/