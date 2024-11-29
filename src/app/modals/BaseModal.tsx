import React from "react";
import {Modal} from "antd";
import {LegacyButtonType} from "antd/es/button/button";

interface BaseModalProps {
    title: string,
    isOpen: boolean,
    onOk: () => void,
    onCancel: () => void,
    okText: string,
    okType: LegacyButtonType
    children: React.ReactNode
}
export const BaseModal: React.FC<BaseModalProps> = ({
    title,
    isOpen,
    onOk,
    onCancel,
    okText = "Ok",
    okType,
    children
}) => {
    return (
        <Modal
            title={title}
            open={isOpen}
            onOk={onOk}
            onCancel={onCancel}
            okText={okText}
            okType={okType}
            >
            {children}
        </Modal>
    );
};