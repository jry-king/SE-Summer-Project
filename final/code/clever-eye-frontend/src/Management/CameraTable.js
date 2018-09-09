import React, {Component} from 'react'
import { cameraApi } from '../Global'
import { message } from 'antd'
import { Icon,Form, Table, Input, Button, Popconfirm } from 'antd';

const Search = Input.Search;

const EditableCell = ({ editable, value, onChange }) => (
    <div>
        {editable
            ? <Input style={{ margin: '-5px 0' }} value={value} onChange={e => onChange(e.target.value)} />
            : value
        }
    </div>
);

const FormItem = Form.Item;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}


const rowSelection = {
    getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User', // Column configuration not to be checked
        name: record.name,
    }),
};

class CameraTable extends Component{
	componentDidMount() {
			// To disabled submit button at the beginning.
		this.props.form.validateFields();
	}
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
            width: '10%',
            sorter: (a, b) => b.param1.length - a.param1.length,
            render: (text, record) => this.renderColumns(text, record, 'param1'),
        },{
            title: 'Param2',
            dataIndex: 'param2',
            width: '10%',
            sorter: (a, b) => b.param2.length - a.param2.length,
            render: (text, record) => this.renderColumns(text, record, 'param2'),
        },{
            title: 'Param3',
            dataIndex: 'param3',
            width: '10%',
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
    }

    componentDidMount = () => {
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
                "cameraid":target.cameraid,
                "param1":target.param1,
                "param2":target.param2,
                "param3":target.param3,
                "x":target.x,
                "y":target.y,
                "areaid":target.areaid
            }

            fetch(cameraApi.saveCamera, {
                method: 'post',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(msg)

            })
            .then(res => res.json())
            .then(
                (result) => {
                    if (result.status){
                        message.error("Edit Error")
                        console.log(result.message)
                    }
                    else {
                        message.success("Edit Success")
                        this.setState({edit:false})
                    }
                },
                (error) => {
                    message.error("Network Error")
                    console.log(error)
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
        fetch(cameraApi.getAllCamera, {
            method: 'get',
            credentials: 'include'
        })
        .then(res => res.json())
        .then(
            (result) => {
                if (result.status)
                    message.error(result.message)
                else
                    this.setState({
                        cameras: result,
                        videoUrl: result[0].url
                    })
            },
            (error) => {
                message.error("Network Error")
                console.log(error)
            }
        )
    }

    deleteCamera = (cameraid) => {
        fetch(cameraApi.deleteCameraByCameraid + "/" + cameraid,{
            method:'delete',
            credentials: 'include'
        })
        .then(
            (result) => {
                if (result.ok===false)
                    message.error(result.message)
                else{
                    let cameras = this.state.cameras
                    for (let i in cameras){
                        if (cameras[i].cameraid===cameraid){
                            cameras.splice(i,1)
                            break
                        }
                    }
                    message.success("Delete Success")
                    this.setState({cameras: cameras})
                }
            },
            (error) => {
                message.error("Network Error")
                console.log(error)
            }
        )
	}

		  handleSubmit = (e) => {
			e.preventDefault();
			this.props.form.validateFields((err, values) => {
			  if (!err) {
					let msg = values;
					msg['cameraid'] = 0;
				
				fetch(cameraApi.saveCamera, {
					method: 'post',
					credentials: 'include',
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(msg)
				})
				.then(res => res.json())
				.then(
					(result)=>{
						if (result.status){
							message.error("Edit Error")
							console.log(result.message)
						}
						else {
							message.success("Edit Success")
							this.setState({edit:false})
						}
					},
					(error) => {
						message.error("Network Error")
						console.log(error)
					}
				)
			  }
			});
		  }

    render(){
        const cameras = this.state.cameras;
		for (let id in cameras){
			cameras[id]["key"]=cameras[id]["cameraid"];
		}
        const columns = this.columns;
		const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
		// Only show error after a field is touched.
		const Param1Error = isFieldTouched('Param1') && getFieldError('Param1');
		const Param2Error = isFieldTouched('Param2') && getFieldError('Param2');
		const Param3Error = isFieldTouched('Param3') && getFieldError('Param3');
		const AreaError = isFieldTouched('Area') && getFieldError('Area');
		const PositionXError = isFieldTouched('PositionX') && getFieldError('PositionX');
		const PositionYError = isFieldTouched('PositionY') && getFieldError('PositionY');		
        
		return(
		<div>
			  <Form layout="inline" onSubmit={this.handleSubmit}>
			  
				<FormItem
				  validateStatus={Param1Error ? 'error' : ''}
				  help={Param1Error || ''}
				  style={{ width:'130px' }} 
				>
				  {getFieldDecorator('param1', {
					rules: [{ required: true, message: 'Please input Param1' }],
				  })(
					<Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Param1" />
				  )}
				</FormItem>
				
				<FormItem
				  validateStatus={Param2Error ? 'error' : ''}	
				  help={Param2Error || ''}
				  style={{ width:'130px' }} 
				>
				  {getFieldDecorator('param2', {
					rules: [{ required: true, message: 'Please input Param2' }],
				  })(
					<Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Param2" />
				  )}
				</FormItem>
				
				<FormItem
				  validateStatus={Param3Error ? 'error' : ''}
				  help={Param3Error || ''}
				  style={{ width:'130px' }}
				>
				  {getFieldDecorator('param3', {
					rules: [{ required: true, message: 'Please input Param3' }],
				  })(
					<Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Param3" />
				  )}
				</FormItem>
				
				<FormItem
				  validateStatus={AreaError ? 'error' : ''}
				  help={AreaError || ''}
				  style={{ width:'130px' }}
				>
				  {getFieldDecorator('areaid', {
					rules: [{ required: true, message: 'Please input Area!' }],
				  })(
					<Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="Area" placeholder="Area" />
				  )}
				</FormItem>
				
				<FormItem
				  validateStatus={PositionXError ? 'error' : ''}
				  help={PositionXError || ''}
				  style={{ width:'130px' }}
				>
				  {getFieldDecorator('x', {
					rules: [{ required: true, message: 'Please input PositionX!' }],
				  })(
					<Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="PositionX" placeholder="PositionX" />
				  )}
				</FormItem>
				
				<FormItem
				  validateStatus={PositionYError ? 'error' : ''}
				  help={PositionYError || ''}
				  style={{ width:'130px' }}
				>
				  {getFieldDecorator('y', {
					rules: [{ required: true, message: 'Please input PositionY!' }],
				  })(
					<Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="PositionY" placeholder="PositionY" />
				  )}
				</FormItem>
				
				<FormItem>
				  <Button
					type="primary"
					htmlType="submit"
					disabled={hasErrors(getFieldsError())}
				  >
					Add
				  </Button>
				</FormItem>
			  </Form>
			<div>
                <Table className = "table" bordered rowSelection={rowSelection} dataSource={cameras} columns={columns} onChange={this.onChange} onDelete={this.deleteCamera} />
			</div>

		</div>
        )
    }
}

const WrappedCameraTable = Form.create()(CameraTable);

export default WrappedCameraTable