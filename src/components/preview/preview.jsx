import './preview.scss';
import Stack from '@mui/material/Stack';
import { DataGrid } from '@mui/x-data-grid';

const Preview = (props) => {
    const {dataRows, dataColumns, pageSize, ...otherProps} = props; 

    return (
        <div className="preview">
            <DataGrid
                rows={dataRows}
                columns={dataColumns}
                pageSize={pageSize}
                rowsPerPageOptions={[pageSize]}
                {...otherProps}
                components={{
                    NoRowsOverlay: () => (
                      <Stack height="100%" alignItems="center" justifyContent="center">
                        No data
                      </Stack>
                    )
                  }}
            />
        </div>
    )
}

export default Preview;