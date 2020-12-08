import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Select } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';

import AppLayout from '../components/AppLayout';
import { UPLOAD_POST_REQUEST } from '../reducers/post';
import useInput from '../hooks/useInput';

const DeleteButton = styled(MinusCircleOutlined)`
  margin: 0 8px;
  cursor: pointer;
  position: relative;
  top: 4px;
  font-size: 24px;
  color: #999;
  transition: all 0.3s;
  &:hover {
    color: #777;
  }
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};

const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 20, offset: 4 },
  },
};

const postWrite = () => {
  const dispatch = useDispatch();
  const { me } = useSelector((state) => state.user);
  const { postDone } = useSelector((state) => state.post);
  const [desc, onChangeDesc, setDesc] = useInput('');
  const [title, onChangeTitle, setTitle] = useInput('');
  const [category, onChangeCategory] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (postDone) {
      router.push('/');
    }
  }, [postDone]);

  const onSubmit = (values) => {
    if (!title.length) {
      return alert('제목을 입력 해주세요');
    }
    dispatch({
      type: UPLOAD_POST_REQUEST,
      data: {
        userId: me._id,
        questions: values.questions,
        title,
        desc,
        category,
      },
    });
    setDesc('');
    setTitle('');
  };

  const handleChangeCategory = (value) => {
    onChangeCategory(value);
  };

  return (
    <AppLayout>
      <Form
        name="dynamic_form_item"
        {...formItemLayoutWithOutLabel}
        onFinish={onSubmit}
      >
        <Form.Item label="제목">
          <Input
            placeholder="제목을 입력 해주세요"
            value={title}
            onChange={onChangeTitle}
          />
        </Form.Item>
        <Form.Item label="카테고리">
          <Select
            defaultValue="FrontEnd"
            style={{ width: 120 }}
            onChange={handleChangeCategory}
          >
            <Select.Option value="FrontEnd">FrontEnd</Select.Option>
            <Select.Option value="BackEnd">BackEnd</Select.Option>
            <Select.Option value="others">others</Select.Option>
          </Select>
        </Form.Item>
        <Form.List
          name="questions"
          rules={[
            {
              validator: async (_, questions) => {
                if (!questions || questions.length < 5) {
                  return Promise.reject(
                    new Error('질문을 5개 이상 작성 해주세요.'),
                  );
                } else if (questions.length > 10) {
                  return Promise.reject(
                    new Error('질문은 10개 까지 작성 가능 합니다.'),
                  );
                }
              },
            },
          ]}
        >
          {(fields, { add, remove }, { errors }) => (
            <>
              {fields.map((field, index) => (
                <Form.Item
                  {...(index === 0
                    ? formItemLayout
                    : formItemLayoutWithOutLabel)}
                  label={`${index + 1}: `}
                  required={false}
                  key={field.key}
                >
                  <Form.Item
                    {...field}
                    validateTrigger={['onChange', 'onBlur']}
                    rules={[
                      {
                        required: true,
                        whitespace: true,
                        message: '질문을 입력하거나 지워주세요',
                      },
                    ]}
                    noStyle
                  >
                    <Input
                      placeholder="질문을 입력 해주세요"
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                  {fields.length > 1 ? (
                    <DeleteButton onClick={() => remove(field.name)} />
                  ) : null}
                </Form.Item>
              ))}
              <Form.Item>
                {fields.length < 10 && (
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    style={{ width: '100%' }}
                    icon={<PlusOutlined />}
                  >
                    질문 추가
                  </Button>
                )}
                <Form.ErrorList errors={errors} />
              </Form.Item>
            </>
          )}
        </Form.List>
        <Form.Item label="설명">
          <Input.TextArea
            value={desc}
            onChange={onChangeDesc}
            maxLength={200}
            placeholder="세션 설명을 적어주세요"
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            글 작성
          </Button>
        </Form.Item>
      </Form>
    </AppLayout>
  );
};

export default postWrite;
