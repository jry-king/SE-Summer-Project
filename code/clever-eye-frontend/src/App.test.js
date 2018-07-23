import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { shallow, render } from 'enzyme';

import Map from './Utils/Map'
import Camera from './Utils/Camera'
import VideoCrop from './Utils/VideoCrop'
import { dataApi, videoServer } from './Global'

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
    })
})

describe('Test Api', () => {
    test('Test /api/camera?areaid=1', () => {
        return fetch(dataApi + 'camera?areaid=1',{
                method: 'get'
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
                method: 'get'
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
                method: 'get'
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

    test('Test /camera?areaid=' + testid + '\n\t- fetch the camera data ( cameraid = '+testid+', areaid = '+testid+')', () => {
        return fetch(dataApi + 'camera?areaid=' + testid,{
                method: 'get'
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
                method: 'get'
            })
            .then(res => res.json())
            .then(
                (result) => {
                    expect(result.status).toBeUndefined()
                    expect(result).toEqual([])
            });
    });
	
	
})





