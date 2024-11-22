import type { Meta, StoryObj } from '@storybook/react';
// @ts-ignore
import FormContainer from 'mf2/FormContainer';

const meta = {
    title: 'Components/FormContainer',
    component: FormContainer,
    parameters: {
        // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
        layout: 'fullscreen',
    },
} satisfies Meta<typeof FormContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        schema: {
            table: "table",
            columns: [
                {
                    name: "name",
                    type: "text",
                    required: true
                }
            ]
        }
    },
};