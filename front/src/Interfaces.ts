import React from "react";

interface IStatusResponse {
  status: boolean;
  error?: string;
}

interface IAuthResponse {
  status: boolean;
  error?: string;
  token?: string;
}

interface IGithubEnv {
  status: boolean;
  scope: string;
  clientId: string;
  state: string;
}

interface IFormProps {
  handleClose: any;
  setError: React.Dispatch<React.SetStateAction<string>>;
}

interface IProfileData {
  username: string;
  email: string;
  twitterLinked: boolean;
  githubLinked: boolean;
  trelloLinked: boolean;
  redditLinked: boolean;
  todoistLinked: boolean;
  discordLinked: boolean;
}

interface IProfileProps {
  infos: IProfileData;
  setInfos: React.Dispatch<React.SetStateAction<IProfileData>>;
}

interface IRedirectOAuth {
  status: boolean;
  redirectUrl?: string;
  error?: string;
}

interface ITwitterOAuth {
  status: boolean;
  url?: string;
  error?: string;
}

interface IDiscordOAuth {
  status: boolean;
  clientId: string;
  scope: string;
}


interface IAccountSettings {
  username?: string;
  password?: string;
  email?: string;
}

interface IParameter {
  name: string;
  type: string;
  placeholder?: string;
  value?: any;
  options?: IParameter[];
  route?: string;
  isOptional?: boolean;
}

interface IWidget {
  name: string;
  displayName: string;
  description: string;
  params: IParameter[];
}

interface IAction {
  name: string;
  displayName: string;
  description: string;
  needsOauth: string;
  widgets: IWidget[];
}

interface IServiceListItem {
  value: string;
  label: string;
  description: string;
  widgets: IWidget[];
  isDisabled?: boolean;
}

interface IEventListItem {
  value: string;
  label: string;
  description: string;
  parameters: IParameter[];
}

interface IDropdownListItem {
  name: string;
  label: string;
  value: any;
  type: string;
}

interface IListParamsProps {
  event: IEventListItem;
  editParams: (edit: IParameter, value: any) => void;
}

interface IParameterProps {
  index: number;
  element: IParameter;
  editParams: (edit: IParameter, value: any) => void;
}

interface IInstanceConfig {
  name: string;
  serviceName: string;
  displayName: string;
  webhookId?: string;
  params: IParameter[];
}

interface IInstance {
  _id?: string,
  userId?: string,
  action?: IInstanceConfig;
  reaction?: IInstanceConfig;
}

interface IInstanceRequest {
  status: boolean,
  instances: IInstance[]
}

interface IServiceChoiceProps {
  servicesList: IServiceListItem[];
  editInstance: (type: string, config: IInstanceConfig) => void;
  setRequired: (type: string, config: IInstanceConfig) => void;
  type: string;
}

interface IModalInstanceProps {
  open: boolean;
  handleClose: () => void;
  refreshInstances: () => void;
  emitError: (error: string) => void;
}

interface IInstanceEditorProps {
  instance: IInstance;
  saveInstance: (instance: IInstance) => void;
  deleteInstance: (instance: IInstance) => void;
  actions: IAction[];
  reactions: IAction[];
}

export type {
  IStatusResponse,
  IAuthResponse,
  IProfileProps,
  IGithubEnv,
  IFormProps,
  IProfileData,
  IRedirectOAuth,
  ITwitterOAuth,
  IDiscordOAuth,
  IAccountSettings,
  IParameter,
  IWidget,
  IAction,
  IServiceListItem,
  IEventListItem,
  IListParamsProps,
  IParameterProps,
  IInstanceConfig,
  IInstance,
  IServiceChoiceProps,
  IModalInstanceProps,
  IInstanceRequest,
  IInstanceEditorProps,
  IDropdownListItem
};
