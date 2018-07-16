import React, {Component} from 'react'
import CameraRow from './CameraRow'
import { dataApi } from '../Global'
import { message } from 'antd'
import { Table, Input, Button, Popconfirm ,Icon } from 'antd';

const Search = Input.Search;

const EditableCell = ({ editable, value, onChange }) => (
    <div>
        {editable
            ? <Input style={{ margin: '-5px 0' }} value={value} onChange={e => onChange(e.target.value)} />
            : value
        }
    </div>
);

const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User', // Column configuration not to be checked
        name: record.name,
    }),
};

class CameraTable extends Component{
    constructor(props){
        super(props)
        this.state = {
            filterDropdownVisible: false,
            searchText: '',
            filtered: false,
            dataSource: [],
            count : 6,
            tempkey : 0,
            cameras: null,
        }    
	
	    this.columns = [{
            title: 'CameraId',
            dataIndex: 'cameraid',
            width: '10%',

            filteredValue: this.state.searchText || null,
            onFilter: (filteredValue, record) => record.name.includes(filteredValue),

            sorter: (a, b) => b.cameraid - a.cameraid,
            render: (text, record) => this.renderColumns(text, record, 'cameraid'),
        },{
            title: 'Param1',
            dataIndex: 'param1',
            width: '15%',
            sorter: (a, b) => b.param1.length - a.param1.length,
            render: (text, record) => this.renderColumns(text, record, 'param1'),
        },{
            title: 'Param2',
            dataIndex: 'param2',
            width: '15%',
            sorter: (a, b) => b.param2.length - a.param2.length,
            render: (text, record) => this.renderColumns(text, record, 'param2'),
        },{
            title: 'Param3',
            dataIndex: 'param3',
            width: '15%',
            sorter: (a, b) => b.param3.length - a.param3.length,
            render: (text, record) => this.renderColumns(text, record, 'param3'),
        },{
            title: 'Area',
            dataIndex: 'areaid',
            width: '10%',
            sorter: (a, b) => b.areaid - a.areaid,
            render: (text, record) => this.renderColumns(text, record, 'areaid'),
        },
            {
                title: 'Position X',
                dataIndex: 'x',
                width: '10%',
                sorter: (a, b) => b.x - a.x,
                render: (text, record) => this.renderColumns(text, record, 'x'),
            },
			{
                title: 'Position Y',
                dataIndex: 'y',
                width: '10%',
                sorter: (a, b) => b.y - a.y,
                render: (text, record) => this.renderColumns(text, record, 'y'),
            },
            {
            title: 'Edit',
            dataIndex: 'edit',
            width: '10%',
            render: (text, record) => {
				const { editable } = record;
                return (
                    <div className="editable-row-operations">
                        {
                            editable ?
                                <span>
                  <a onClick={() => this.save(record.key)}>Save </a>
                  <Popconfirm title="Sure to cancel?" onConfirm={() => this.cancel(record.key)}>
                    <a>Cancel</a>
                  </Popconfirm>
					</span>
                                : <a onClick={() => this.edit(record.key)}>Edit</a>
                        }
                    </div>
                );
            },
        },{
            title: 'Delete',
            dataIndex: 'delete',
            width: '10%',
            render: (text, record) => {
                return (
                    this.state.cameras.length > 1 ?
                        (
                            <Popconfirm title="Sure to delete?" onConfirm={() => this.deleteCamera(record.key)}>
                                <a>Delete</a>
                            </Popconfirm>
                        ) : null
                );
            },
        }];
        
		this.cacheData = this.state.dataSource.map(item => ({ ...item }));
	
		this.getCamera()

    }
	
	
    onInputChange = (e) => {
        this.setState({ searchText: e.target.value });
    }

    onSearch = () => {
        const { searchText } = this.state;
        const reg = new RegExp(searchText, 'gi');
        this.setState({
            filterDropdownVisible: false,
            filtered: !!searchText,
            dataSource: this.state.dataSource.map((record) => {
                const match = record.bookname.match(reg);
                if (!match) {
                    return null;
                }
                return {
                    ...record,
                    bookname: (
                        <span>
              {record.bookname.split(reg).map((text, i) => (
                  i > 0 ? [<span className="highlight">{match[0]}</span>, text] : text
              ))}
            </span>
                    ),
                };
            }).filter(record => !!record),
        });
    }

    renderColumns(text, record, column) {
        return (
            <EditableCell
                editable={record.editable}
                value={text}
                onChange={value => this.handleChange(value, record.key, column)}
            />
        );
    }

    handleChange(value, key, column) {
        const newData = [...this.state.data];
        const target = newData.filter(item => key === item.key)[0];
        if (target) {
            target[column] = value;
            this.setState({ data: newData });
        }
    }
	
	

    onChange = (pagination, filters, sorter) => {
        console.log('Various parameters', pagination, filters, sorter);
        this.setState({
            filteredInfo: Search.value,
        });
    }

    edit(key) {
        const newData = [...this.state.cameras];
        const target = newData.filter(item => key === item.key)[0];
        if (target) {
            target.editable = true;
            this.setState({ data: newData });
        }
    }

    save(key) {
        const newData = [...this.state.data];
        const target = newData.filter(item => key === item.key)[0];
        if (target) {
            delete target.editable;
            this.setState({ data: newData });
            this.cacheData = newData.map(item => ({ ...item }));
        }

            let msg = {
                "cameraid":encodeURIComponent(this.state.cameraid),
                "param1":encodeURIComponent(this.state.param1),
                "param2":encodeURIComponent(this.state.param2),
                "param3":+encodeURIComponent(this.state.param3),
                "x":+encodeURIComponent(this.state.x),
                "y":encodeURIComponent(this.state.y),
                "areaid":+encodeURIComponent(this.state.areaid)
            }

            fetch(dataApi+"camera/save", {
                method: 'post',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: msg

            })
            .then(res => res.json())
            .then(
                (result)=>{
                    if (result.status)
                        message.error("Edit Error:\n"+result.msg)
                    else {
                        message.success("Edit Success")
                        this.setState({edit:false})
                    }
                },
                (error) => {
                    message.error("Edit Error:\n"+error)
                }
            )
        }

    cancel(key) {
        const newData = [...this.state.data];
        const target = newData.filter(item => key === item.key)[0];
        if (target) {
            Object.assign(target, this.cacheData.filter(item => key === item.key)[0]);
            delete target.editable;
            this.setState({ data: newData });
        }
    }

    getCamera = () => {
        fetch(dataApi + "camera/all",{
            method: 'get',
            credentials: 'include'
        })
        .then(res => res.json())
        .then(
            (result) => {
                if (result.status)
                    message.error(result.msg)
                else
                    this.setState({
                        cameras: result,
                        videoUrl: result[0].url
                    })
            },
            (error) => {
                message.error(error)
            }
        )
    }

    deleteCamera = (key) => {
        fetch(dataApi + "camera/delete?key=" + key,{
            method:'get',
            credentials: 'include'
        })
        .then(res => res.json())
        .then(
            (result) => {
                if (result.status)
                    message.error(result.msg)
                else{
                    message.success("Delete Success")
                    this.setState({cameras:result})
                }
            },
            (error) => {
                message.error("Delete Book Error:\n"+error)
            }
        )
    }


    render(){
        const cameras = this.state.cameras;
        const columns = this.columns;
        return(
		<div>
		
			<div>
                <Button className = "add-btn" type="primary" onClick={ this.addCamera }>Add a new Camera</Button>
                <Table className = "table" bordered rowSelection={rowSelection} dataSource={cameras} columns={columns} onChange={this.onChange} onDelete={this.deleteCamera} />
			</div>
			
            <table className='managementTable'>
                <thead>
                    <tr>
                    <th>Cameraid</th>
                    <th>Param1</th>
                    <th>Param2</th>
                    <th>Param3</th>
                    <th>Area</th>
                    <th>Position X</th>
                    <th>Position Y</th>
                    <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {   
                        cameras?cameras.map((camera) => {
                            return (
                                <CameraRow key={camera.key} camera={camera}/>
                            )
                        }):null
                    }
                </tbody>
            </table>

		</div>
        )
    }
}
export default CameraTable




