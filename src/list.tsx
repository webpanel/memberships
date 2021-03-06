import * as React from "react";

import { Button, List, Popconfirm, Popover, Select } from "antd";
import { DeleteOutlined, UserOutlined } from "@ant-design/icons";

import { SelectProps } from "antd/lib/select";

interface IMembershipListRole {
  id: string;
  name: string;
}

interface IMember {
  id: string;
  email: string;
  [key: string]: any;
}
interface IMembership {
  id: string;
  role: string;
  member: IMember;
}

export type IPopoverContentHandler = (
  memberships: IMembership
) => React.ReactNode;

interface IMembershipListProps {
  loading: boolean;
  footer: React.ReactNode;
  memberships: IMembership[];
  roles: IMembershipListRole[];
  onDelete: (id: string) => Promise<void>;
  readonly?: boolean;
  popoverContent?: IPopoverContentHandler;
}

export class MembershipListComponent extends React.Component<IMembershipListProps> {
  public render() {
    const {
      loading,
      footer,
      memberships,
      roles,
      onDelete,
      readonly,
      popoverContent,
    } = this.props;

    return (
      <List
        size="small"
        loading={loading}
        footer={footer}
        bordered={false}
        dataSource={memberships}
        itemLayout="horizontal"
        renderItem={(item: IMembership) => {
          return (
            <List.Item
              actions={[
                !readonly && (
                  <Popconfirm
                    key="delete"
                    title="Are you sure?"
                    okText="Yes"
                    cancelText="No"
                    icon={<UserOutlined />}
                    onConfirm={() => {
                      if (onDelete) {
                        (async function () {
                          await onDelete(item.id);
                        })();
                      }
                    }}
                  >
                    <Button
                      key="delete"
                      icon={<DeleteOutlined />}
                      size="small"
                      danger={true}
                    />
                  </Popconfirm>
                ),
              ]}
            >
              <List.Item.Meta
                title={
                  <Popover
                    content={
                      popoverContent
                        ? popoverContent(item)
                        : `ID: ${item.member.id}`
                    }
                  >
                    {item.member.email}
                  </Popover>
                }
              />
              {this.rolesSelect({
                roles,
                value: item.role,
                props: { size: "small", disabled: true },
              })}
            </List.Item>
          );
        }}
      />
    );
  }

  private rolesSelect(props: {
    roles?: IMembershipListRole[];
    value?: string;
    props?: SelectProps<any>;
  }): React.ReactNode | undefined {
    return (
      props.roles && (
        <Select value={props.value} style={{ width: "120px" }} {...props.props}>
          {props.roles.map((r) => (
            <Select.Option value={r.id}>{r.name}</Select.Option>
          ))}
        </Select>
      )
    );
  }
}
