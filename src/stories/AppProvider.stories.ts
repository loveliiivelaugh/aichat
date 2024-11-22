import type { Meta, StoryObj } from '@storybook/react';
// @ts-ignore
import AppProvider from 'mf2/AppProvider';

const meta = {
    title: 'Components/AppProvider',
    component: AppProvider,
    parameters: {
        // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
        layout: 'fullscreen',
    },
} satisfies Meta<typeof AppProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        children: () => ("")
    }
};
